$('#home').on('pageinit', function(){
	//code needed for home page goes here
});	
		
$('#addItem').on('pageinit', function(){

		var myForm = $('#addToDoForm');
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
		var data = myForm.serializeArray();
			storeData(data);
		}
	});
	
	//any other code needed for addItem page goes here
	
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.

var autofillData = function (){
	 
};

var getData = function(){

};

var storeData = function (data) {
    var key;
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


