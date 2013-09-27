//ASD 1309
//Author: Garrett Moore
//Refactored from VFW

var toDoLibrary = {
    pageInits: {
		todoInit: function() {
			
		},
        homeInit: function () {
            
        },
        itemsInit: function () {
            toDoLibrary.operations.getToDos();

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
                url: "teamMembers.xml",
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
                var todoData = {
				_id: $("#editToDoForm #id").val(),
				_rev: $("#editToDoForm #rev").val(),
				firstName: $("#editToDoForm #txtFirstName").val(),
				lastName: $("#editToDoForm #txtLastName").val(),
				toDoName: $("#editToDoForm #txtToDoName").val(),
				dtDue: $("#editToDoForm #txtDueDate").val(),
				assinedTo: $("#editToDoForm #ddlAssignedTo").val(),
				priority: $("#editToDoForm #rngPriority").val(),
				emailTaskReceiver: $("#editToDoForm #sldEmailTaskReceiver").val(),
				content: $("#editToDoForm #txtContent").val(),
			};
			console.log(todoData);
			$.couch.db("asd_teamtodolist").saveDoc(todoData, {
				success: function (data) {
					console.log(data)
				},
				error: function (status) {
					console.log(status)
				}
			});
			alert("To-Do Edited");
			$.mobile.changePage("index.html");
        },
        storeData: function (data, key) {
                var todoData = {
				firstName: $("#addToDoForm #txtFirstName").val(),
				lastName: $("#addToDoForm #txtLastName").val(),
				toDoName: $("#addToDoForm #txtToDoName").val(),
				dtDue: $("#addToDoForm #txtDueDate").val(),
				assinedTo: $("#addToDoForm #ddlAssignedTo").val(),
				priority: $("#addToDoForm #rngPriority").val(),
				emailTaskReceiver: $("#addToDoForm #sldEmailTaskReceiver").val(),
				content: $("#addToDoForm #txtContent").val(),
				type: "todo"
			};
			console.log(todoData);
			$.couch.db("asd_teamtodolist").saveDoc(todoData, {
				success: function (data) {
					console.log(data)
				},
				error: function (status) {
					console.log(status)
				}
			});
			alert("To-Do Edited");
			$.mobile.changePage("index.html");
        },
        autoPopulateData: function () {
            //Populate to-do records from JSON file it localStorage is empty.
            for (var n in json) {
                var id = Math.floor(Math.random() * 100000001);
                localStorage.setItem(id, JSON.stringify(json[n]));
            }
        },
        getToDos: function () {
            var ToDoItems = {};
            
            $.couch.db("asd_teamtodolist").view("teamtodolist/todos", {
            	success: function(data) {
            		var divItems = $("div#items div[data-role='content'] ul");
				  $.each(data.rows, function(index, todos){

	                divItems.append('<li>' +
	                    '<a href="edit.html?todo=' + todos.key + '" data-key="' + todos.id + '">' + todos.value.toDoName +
	                    '<br />Due: ' + todos.value.dtDue + '</a>' +
	                    '</li>');
            	});
            	divItems.listview('refresh');
				  }
    		});
            
            /*$.ajax({
            "url": "_view/todos",
            "dataType": "json",
            "success": function(data) {
            	var divItems = $("div#items div[data-role='content'] ul");
            	$.each(data.rows, function(index, todos){

	                divItems.append('<li>' +
	                    '<a href="#addItem" data-key="' + todos.id + '">' + todos.value.toDoName +
	                    '<br />Due: ' + todos.value.dtDue + '</a><button class=\'delToDo\' data-key=' + todos.id + '>Delete</button>' +
	                    '</li>');
            	});
            	divItems.listview('refresh');
            }
            
            });*/
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

$(document).on("pageinit", "#editTodo", function () {
	var urlData = $(this).data("url");
    		var urlParts = urlData.split("?");
			var urlPairs = urlParts[1].split("&");
			var urlValues = {};
			for (var i in urlPairs) {
				var keyValue = urlPairs[i].split("=");
				var key = decodeURIComponent(keyValue[0]);
				var value = decodeURIComponent(keyValue[1]);
				urlValues[key] = value;
			}
			var keyInfo = urlValues["todo"];
			console.log(keyInfo);
			$.couch.db("asd_teamtodolist").view("teamtodolist/todos", {
				key: keyInfo,
        success: function (todoData) {
            $.each(todoData.rows, function (index, todoInfo) {
                var todoItem = (todoInfo.value || todoInfo.doc)
                var doc = {
                    _id: todoItem.id,
                    _rev: todoItem.rev
                }
                $("#editToDoForm #id").val(todoItem._id);
				$("#editToDoForm #rev").val(todoItem._rev);
                $("#editToDoForm #txtFirstName").val(todoItem.firstName);
                $("#editToDoForm #txtLastName").val(todoItem.lastName);
                $("#editToDoForm #txtToDoName").val(todoItem.toDoName);
                $("#editToDoForm #txtDueDate").val(todoItem.dtDue);
                $("#editToDoForm #ddlAssignedTo").val(todoItem.assignedTo);
                $("#editToDoForm #ddlAssignedTo").selectmenu('refresh');
                $("#editToDoForm #rngPriority").val(todoItem.priority);
                $("#editToDoForm #sldEmailTaskReceiver").val(todoItem.sendEmail);
                $("#editToDoForm #txtContent").val(todoItem.content);
            });
        }
    });
	var myForm = $('#editToDoForm');
            myForm.validate({
                invalidHandler: function (form, validator) {
                },
                submitHandler: function () {
                    var data = myForm.serializeArray();
                    var key = $("#id").val();
                    toDoLibrary.operations.editToDo();
                }
            });
});

$(document).on("pageinit", "#todo", function () {
			var urlData = $(this).data("url");
    		var urlParts = urlData.split("?");
			var urlPairs = urlParts[1].split("&");
			var urlValues = {};
			for (var i in urlPairs) {
				var keyValue = urlPairs[i].split("=");
				var key = decodeURIComponent(keyValue[0]);
				var value = decodeURIComponent(keyValue[1]);
				urlValues[key] = value;
			}
			var keyInfo = urlValues["todo"];
			console.log(keyInfo);
			$.couch.db("asd_teamtodolist").view("teamtodolist/todos", {
				key: keyInfo,
				success: function (data) {
            $.each(data.rows, function (index, todoInfo) {
                var todoItem = (todoInfo.value || todoInfo.doc)
                var todoDoc = {
                    "id": todoItem.id,
                    "rev": todoItem.rev,
                };
                $("#deleteToDo").attr("href", "delete.html?todo=" + todoItem.id)
                $("#editMyToDo").attr("href", "edit.html?todo=" + todoItem.id)
                var todoLI = $("<li></li>");
                var todoDisplayInfo = $(
                    "<h3>" + todoItem.toDoName + "</h3>" +
                    "<p>" + todoItem.firstName + "</p>" +
                    "<p>" + todoItem.lastName + "</p>" +
                    "<p>" + todoItem.assignedTo + "</p>" +
                    "<p>" + todoItem.priority + "</p>" +
                    "<p>" + todoItem.sendEmail + "</p>" +
                    "<p>" + todoItem.content + "</p>" +
                    "<p>" + todoItem.dtDue + "</p>"
                    );
                todoLI.append(todoDisplayInfo).appendTo("#todoInfo");
            });
            $("#todoInfo").listview('refresh');
        }
			});

	toDoLibrary.pageInits.todoInit();
});

$('#items').on('pageinit', function () {
    toDoLibrary.pageInits.itemsInit();
});

$('#editToDo').on('click', function () {
    toDoLibrary.operations.editToDo();
});

$('#members').on('pageinit', function () {
    toDoLibrary.pageInits.membersInit();
});
		
$('#addItem').on('pageinit', function () {
    toDoLibrary.pageInits.addItemInit();
});

$('#settings').on('pageinit', function () {
    toDoLibrary.pageInits.settingsInit();
});