//ASD 1307
//Author: Garrett Moore
//Refactored from VFW

//var toDoLibrary = {

var toDoAssignees = {};

$('#home').on('pageinit', function () {

    //Load XML data for Drop Down List in form.
    toDoAssignees = $.ajax({
        type: "GET",
        url: "js/teamMembers.xml",
        dataType: "xml",
        success: function (data, status) {
            $(data).find('teamMember').each(function () {
                var $teamMember = $(this);
                var name = $teamMember.find('name').text();
                $("#ddlAssignedTo").append('<option value="' + name + '">' + name + '</option>');
            });
            //$("#ddlAssignedTo").selectmenu('refresh');
        }
    });
});

$('#items').on('pageinit', function () {

    getToDos();
    
    for (var i = 0, j = localStorage.length; i < j; i++) {

        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        var todo = JSON.parse(value);

        var divItems = $("div#items div[data-role='content'] ul");

        divItems.append('<li>' +
            '<a href="#addItem" data-key="' + key + '">' + todo.toDoName +
            '<br />Due: ' + todo.dtDue + '</p>' + '' +
            '</li>');

        divItems.listview('refresh')

    }

    $("a[data-key][href='#addItem']").on("click", function (event) {
        var toDoId = $(event.target).data('key'); 
        editToDo(toDoId);
    });
});

$('#members').on('pageinit', function () {

    var divMembers = $("div#members div[data-role='content'] ul");

    var toDoTeamMembers = $.ajax({
        type: "GET",
        url: "js/teamMembers.xml",
        dataType: "xml",
        success: function (data, status) {
            $(data).find('teamMember').each(function () {
                var $teamMember = $(this);
                var name = $teamMember.find('name').text();
                divMembers.append('<li>' + name + '</li>');
            });
            divMembers.listview('refresh')
        }
    });
});
		
$('#addItem').on('pageinit', function () {
    var toDoAssigneeList = {};

    $("#ddlAssignedTo").selectmenu('refresh');

	var myForm = $('#addToDoForm');
		myForm.validate({
		    invalidHandler: function(form, validator) {
		},
		submitHandler: function() {
		    var data = myForm.serializeArray();
		    var key = $("#key").val();
		    storeData(data, key);
		}
});
	
    //any other code needed for addItem page goes here
	
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.

editToDo = function (key) {
    //Change to the #addItem page
    $.mobile.changePage($('#addItem'));

    //get the toDo from the passed key
    var todo = localStorage.getItem(key);
    var todoItem = JSON.parse(todo);

    //Populate the form with the retrieved values
    $("#txtFirstName").val(todoItem.firstName);
    $("#txtLastName").val(todoItem.lastName);
    $("#txtToDoName").val(todoItem.toDoName);
    $("#txtDueDate").val(todoItem.dtDue);
    $("#ddlAssignedTo").val(todoItem.assignedTo);
    $("#ddlAssignedTo").selectmenu('refresh');
    $("#rngPriority").val(todoItem.priority);
    $("#sldEmailTaskReceiver").val(todoItem.sendEmail);
    $("#txtContent").val(todoItem.content);

    //Pass Key to hidden input
    $("#key").val(key);

    var link = $("#addItem input[type='submit']");

    //Edit the submit button's value to say "Edit" instead of "Add"
    $("#addItem input[type='submit']").attr("value", "Edit To-Do");
    link.button('refresh');
};

var storeData = function (data, key) {
    if (!key) {
        var id = Math.floor(Math.random() * 100000001);
    } else {
        id = key;
    }
    var item = {};
    item.firstName = ["First Name", data[0].value];
    item.lastName = ["Last Name", data[1].value];
    item.toDoName = ["To-Do Name", data[2].value];
    item.dtDue = ["Due Date", data[4].value];
    item.assignedTo = ["Assigned To", data[3].value];
    item.priority = ["Priority", data[5].value];
    item.sendEmail = ["Send Email to Task Receiver?", data[7].value];
    item.content = ["Content", data[6].value];

    //Save data into Local Storage: Use Stringify to convert our object to a string.
    localStorage.setItem(id, JSON.stringify(item));
    //alert("To-Do Saved!");

    //Reset the Form
    var myForm = $('#addToDoForm');
    myForm[0].reset();
    //Go Home
    $.mobile.changePage($("#home"));


}; 

var	deleteItem = function (){
			
};
					
var clearLocal = function(){

};


function autoPopulateData() {
    //Populate to-do records from JSON file it localStorage is empty.
    for (var n in json) {
        var id = Math.floor(Math.random() * 100000001);
        localStorage.setItem(id, JSON.stringify(json[n]));
    }
}

function getToDos() {
    if (localStorage.length === 0) {
        autoPopulateData();
    }
}