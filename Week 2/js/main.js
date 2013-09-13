//ASD 1309
//Author: Garrett Moore
//Refactored from VFW

var toDoLibrary = {
    pageInits: {
        homeInit: function () {
            //Load XML data for Drop Down List in form.
            var toDoAssignees = $.ajax({
                type: "GET",
                url: "js/teamMembers.xml",
                dataType: "xml",
                success: function (data, status) {
                    $(data).find('teamMember').each(function () {
                        var $teamMember = $(this);
                        var name = $teamMember.find('name').text();
                        $("#ddlAssignedTo").append('<option value="' + name + '">' + name + '</option>');
                    });
                }
            });
            $("#addItemLink").on("click", function (event) {
                toDoLibrary.operations.addToDo();
            });
        },
        itemsInit: function () {
            toDoLibrary.operations.getToDos();

            var divItems = $("div#items div[data-role='content'] ul");

            divItems.empty();

            for (var i = 0, j = localStorage.length; i < j; i++) {

                var key = localStorage.key(i);
                var value = localStorage.getItem(key);
                var todo = JSON.parse(value);

                divItems.append('<li>' +
                    '<a href="#addItem" data-key="' + key + '">' + todo.toDoName +
                    '<br />Due: ' + todo.dtDue + '</a><button class=\'delToDo\' data-key=' + key + '>Delete</button>' +
                    '</li>');

                divItems.listview('refresh')

            }

            $("a[data-key][href='#addItem']").on("click", function (event) {
                var toDoId = $(event.target).data('key');
                toDoLibrary.operations.editToDo(toDoId);
            });

            $(".delToDo").on("click", function (event) {
                var toDoId = $(event.target).data('key');
                toDoLibrary.operations.deleteToDo(toDoId);
            });
        },
        membersInit: function () {
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
        },
        addItemInit: function () {
            var toDoAssigneeList = {};

            $("#ddlAssignedTo").selectmenu('refresh');

            var myForm = $('#addToDoForm');
            myForm.validate({
                invalidHandler: function (form, validator) {
                },
                submitHandler: function () {
                    var data = myForm.serializeArray();
                    var key = $("#key").val();
                    toDoLibrary.operations.storeData(data, key);
                }
            });
        },
        settingsInit: function () {
            $(".clearLocal").on("click", function (event) {
                toDoLibrary.operations.clearLocalStorage();
            });
        }
    },
    operations: {
        editToDo: function (key) {
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
        },
        addToDo: function () {
            //Change to the #addItem page
            $.mobile.changePage($('#addItem'));

            var link = $("#addItem input[type='submit']");

            //Edit the submit button's value to say "Edit" instead of "Add"
            $("#addItem input[type='submit']").attr("value", "Add To-Do");
            link.button('refresh');
        },
        storeData: function (data, key) {
            if (!key) {
                var id = Math.floor(Math.random() * 100000001);
            } else {
                id = key;
            }
            var item = {};
            item.firstName = [data[0].value];
            item.lastName = [data[1].value];
            item.toDoName = [data[2].value];
            item.dtDue = [data[4].value];
            item.assignedTo = [data[3].value];
            item.priority = [data[5].value];
            item.sendEmail = [data[7].value];
            item.content = [data[6].value];

            //Save data into Local Storage: Use Stringify to convert our object to a string.
            localStorage.setItem(id, JSON.stringify(item));
            //alert("To-Do Saved!");

            //Reset the Form
            var myForm = $('#addToDoForm');
            myForm[0].reset();
            //Go Home
            $.mobile.changePage($("#home"));
        },
        autoPopulateData: function () {
            //Populate to-do records from JSON file it localStorage is empty.
            var divItems = $("div#items div[data-role='content'] ul");
            var todoItems = $.ajax({
                type: "GET",
                url: "js/json.js",
                dataType: "json",
                error: function (status) {
                    console.log(status);
                },
                success: function (data) {
                    console.log(data);
                    for (var i = 0, j = data.todos.length; i < j; i++) {
                        var todo = data.todos[i];

                        var id = Math.floor(Math.random() * 100000001);
                        localStorage.setItem(id, JSON.stringify(todo));

                    }
                    divItems.listview('refresh');
                }
            });
            //for (var n in json) {
            //    var id = Math.floor(Math.random() * 100000001);
            //    localStorage.setItem(id, JSON.stringify(json[n]));
            //}
        },
        getToDos: function () {
            if (localStorage.length === 0) {
                toDoLibrary.operations.autoPopulateData();
            }
        },
        deleteToDo: function (key) {
            var confirmPopup = confirm("Are you sure you want to delete this to-do?");
            if (confirmPopup) {
                localStorage.removeItem(key);
                window.location.reload();
            } else {
                alert("No changes were made");
            }
        },
        clearLocalStorage: function () {
            if (localStorage.length === 0) {
                alert("There is no data to clear.");
            } else {
                localStorage.clear();
                alert("All to-do's are deleted!");
                window.location.reload();
                return false;
            }
        }
    }
}

$('#home').on('pageinit', function () {
    toDoLibrary.pageInits.homeInit();
});

$('#items').on('pageinit', function () {
    toDoLibrary.pageInits.itemsInit();
});

$('#items').on('pageshow', function () {
    toDoLibrary.pageInits.itemsInit();
});

$('#members').on('pageinit', function () {
    toDoLibrary.pageInits.membersInit();
});

$('#addItem').on('pageinit', function () {
    toDoLibrary.pageInits.addItemInit();
});

$('#addItem').on('pagehide', function (event, ui) {
    //alert("Prev Page" + ui.nextPage[0].id);
    //console.log(ui.nextPage[0].id);
    if (ui.nextPage[0].id === "home" || ui.nextPage[0].id === "items" || ui.nextPage[0].id === "members" || ui.nextPage[0].id === "settings") {
        var myForm = $('#addToDoForm');
        myForm[0].reset();
    }
});

$('#settings').on('pageinit', function () {
    toDoLibrary.pageInits.settingsInit();
});