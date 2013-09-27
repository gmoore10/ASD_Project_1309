//ASD 1309
//Author: Garrett Moore
//Refactored from VFW

var toDoLibrary = {
    pageInits: {
		todoInit: function () {
			
		},
        homeInit: function () {
            //Load XML data for Drop Down List in form.
            var toDoAssignees = $.ajax({
                type: "GET",
                url: "teamMembers.xml",
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
		editItemInit: function () {
            var toDoAssigneeList = {};

            $("#ddlAssignedTo").selectmenu('refresh');

            var myForm = $('#editToDoForm');
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
		getToDo: function () {
			
		},
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
        addToDo: function () {
            //Change to the #addItem page
            $.mobile.changePage($('#addItem'));

            var link = $("#addItem input[type='submit']");

            //Edit the submit button's value to say "Edit" instead of "Add"
            $("#addItem input[type='submit']").attr("value", "Add To-Do");
            link.button('refresh');
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
			alert("To-Do Added");
			$.mobile.changePage("index.html");
        },
        autoPopulateData: function () {
            //Populate to-do records from JSON file it localStorage is empty.
            //var divItems = $("div#items div[data-role='content'] ul");
			
			$.couch.db("asd_teamtodolist").view("teamtodolist/todos", {
            	success: function(data) {
            		var divItems = $("div#items div[data-role='content'] ul");
				  $.each(data.rows, function(index, todos){

	                divItems.append('<li>' +
	                    '<a href="todo.html?todo=' + todos.key + '" data-key="' + todos.id + '">' + todos.value.toDoName +
	                    '<br />Due: ' + todos.value.dtDue + '</a>' +
	                    '</li>');
            	});
            	divItems.listview('refresh');
				  }
    		});
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

$(document).on("pageinit", "#todoItem", function () {
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
                $("#deleteToDo").attr("href", "delete.html?todo=" + keyInfo)
                $("#editToDoLink").attr("href", "edit.html?todo=" + keyInfo)
                var todoLI = $("<li></li>");
                var todoDisplayInfo = $(
                    "<li><h3>" + todoInfo.value.toDoName + "</h3></li>" +
                    "<li><p>First Name: " + todoInfo.value.firstName + "</p></li>" +
                    "<li><p>Last Name: " + todoInfo.value.lastName + "</p></li>" +
                    "<li><p>Assigned To: " + todoInfo.value.assignedTo + "</p></li>" +
                    "<li><p>Priority: " + todoInfo.value.priority + "</p></li>" +
                    "<li><p>Email Task Receiver?" + todoInfo.value.emailTaskReceiver + "</p></li>" +
                    "<li><p>Content: " + todoInfo.value.content + "</p></li>" +
                    "<li><p>Due Date: " + todoInfo.value.dtDue + "</p></li>"
                    );
                todoLI.append(todoDisplayInfo).appendTo("#todoInfo");
            });
            $("#todoInfo").listview('refresh');
        }
			});

	toDoLibrary.pageInits.todoInit();
});

$(document).on("pageinit", "#editToDo", function () {
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
				
				$("#editToDoForm #id").val(todoInfo.id);
				$("#editToDoForm #rev").val(todoInfo.rev);
				$("#editToDoForm #txtFirstName").val(todoInfo.value.firstName);
				$("#editToDoForm #txtLastName").val(todoInfo.value.lastName);
				$("#editToDoForm #txtToDoName").val(todoInfo.value.toDoName);
				$("#editToDoForm #txtDueDate").val(todoInfo.value.dtDue);
				$("#editToDoForm #ddlAssignedTo").val(todoInfo.value.assignedTo);
				$("#editToDoForm #rngPriority").val(todoInfo.value.priority);
				$("#editToDoForm #sldEmailTaskReceiver").val(todoInfo.value.emailTaskReceiver);
				$("#editToDoForm #txtContent").val(todoInfo.value.content);
            });
        }
	});

	toDoLibrary.pageInits.editItemInit();
});


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

$('#addItem').on('pagehide', function () {
    var myForm = $('#addToDoForm');
    myForm[0].reset();
});

$('#settings').on('pageinit', function () {
    toDoLibrary.pageInits.settingsInit();
});