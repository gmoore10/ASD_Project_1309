// Project 1
// Mobile Interfaces and Usability
// MiU 0413
// By: Garrett Moore

//Wait until the DOM is read.
window.addEventListener("DOMContentLoaded", function () {


    //getElementById Function
    function $$(x) {
        var element = document.getElementById(x);
        return element;
    }

    //Create select field element and populate with options
    function createAssigneeList() {
        var selectListItem = $$('select');

        var makeSelect = document.createElement('select');
        makeSelect.setAttribute("id", "assignedTo");
        for (var i = 0, j = toDoAssignees.length; i < j; i++) {
            var makeOption = document.createElement("option");
            var optText = toDoAssignees[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectListItem.appendChild(makeSelect);
    }

    function getCheckboxValue() {
        if ($$('chkEmailAssignee').checked) {
            chkEmailValue = true;
        }
        else {
            chkEmailValue = false;
        }
    }

    //Function to adjust links that are visible based on which page we are viewing
    function toggleDivs(n) {
        switch (n) {
            case "on":
                $$('toDoForm').style.display = "none";
                $$('linkClearData').style.display = "inline";
                $$('linkDisplayData').style.display = "none";
                $$('linkAddNew').style.display = "inline";
                break;

            case "off":
                $$('toDoForm').style.display = "block";
                $$('linkClearData').style.display = "inline";
                $$('linkDisplayData').style.display = "inline";
                $$('linkAddNew').style.display = "none";
                $$('items').style.display = "none";
                var oldItems = $$('items');
                oldItems.parentNode.removeChild(oldItems);
                break;

            default:
                return false;
        }
    }

    function storeToDo(key) {
        if (!key) {
            var id = Math.floor(Math.random() * 100000001);
        } else {
            id = key;
        }

        //gather up all our form field values and store in an object.
        //Object properties contain array with the form label and input value.
        
        getCheckboxValue();

        var item = {};
        item.firstName = ["First Name", $$('firstname').value];
        item.lastName = ["Last Name", $$('lastname').value];
        item.toDoName = ["To-Do Name", $$('toDoName').value];
        item.dtDue = ["Due Date", $$('dtDue').value];
        item.assignedTo = ["Assigned To", $$('assignedTo').value];
        item.priority = ["Priority", $$('rngPriority').value];
        item.sendEmail = ["Send Email to Task Receiver?", chkEmailValue];
        item.content = ["Content", $$('txtContent').value];

        //Save data into Local Storage: Use Stringify to convert our object to a string.
        localStorage.setItem(id, JSON.stringify(item));
        alert("To-Do Saved!");
    }

    function getToDos() {
        toggleDivs("on");
        if (localStorage.length === 0) {
            alert("There is no data in local storage. Test records were added.");
            autoPopulateData();
        }
        //Write data from Local Storage to the browser.
        var makeDiv = document.createElement('div');
        makeDiv.setAttribute("id", "items");
        makeDiv.setAttribute("class", "divSection");
        var makeList = document.createElement('ul');
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        $$('items').style.display = "block";

        //Get number of local storage items and add list items to ul for each local storage item
        for (var i = 0, j = localStorage.length; i < j; i++) {
            var makeLi = document.createElement('li');
            var linksLi = document.createElement('li');
            makeList.appendChild(makeLi);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);

            //Convert string from localStorage to object
            var todo = JSON.parse(value);
            var makeSubList = document.createElement('ul');
            makeLi.appendChild(makeSubList);

            getAssignedToImage(todo.assignedTo[1], makeSubList);

            for (var n in todo) {
                var makeSubLi = document.createElement('li');
                makeSubList.appendChild(makeSubLi);
                var todoSubText = todo[n][0] + " " + todo[n][1];
                makeSubLi.innerHTML = todoSubText;
                makeSubList.appendChild(linksLi);
            }
            makeToDoLinks(localStorage.key(i), linksLi); //Edit and Delete Links will be created
        }
    }

    function getAssignedToImage(assignedName, makeSubList) {
        var imgLi = document.createElement('li');
        makeSubList.appendChild(imgLi);
        var newImage = document.createElement('img');
        var imgSrc = newImage.setAttribute("src", "img/" + assignedName + ".png");
        imgLi.appendChild(newImage);
    }

    function autoPopulateData() {
        //Populate to-do records from JSON file it localStorage is empty.
        for (var n in json) {
            var id = Math.floor(Math.random() * 100000001);
            localStorage.setItem(id, JSON.stringify(json[n]));
        }
    }

    //Make Item Links
    //TODO: Change Name of vars
    //Create the edit and delete links for each stored item when displayed.
    function makeToDoLinks(key, linksLi) {
        //Add edit single item link
        var editAnchor = document.createElement('a');
        editAnchor.href = "#";
        editAnchor.key = key;
        var editAnchorText = "Edit To-Do";
        editAnchor.addEventListener("click", editToDo);
        editAnchor.innerHTML = editAnchorText;
        linksLi.appendChild(editAnchor);

        //Add <br />
        var br = document.createElement('br');
        linksLi.appendChild(br);

        //Delete Link
        var deleteAnchor = document.createElement('a');
        deleteAnchor.href = "#";
        deleteAnchor.key = key;
        var deleteAnchorText = "Delete To-Do";
        deleteAnchor.addEventListener("click", deleteToDo);
        deleteAnchor.innerHTML = deleteAnchorText;
        linksLi.appendChild(deleteAnchor);
    }

    function deleteToDo() {
        var confirmPopup = confirm("Are you sure you want to delete this to-do?");
        if (confirmPopup) {
            localStorage.removeItem(this.key);
            window.location.reload();
        } else {
            alert("No changes were made");
        }
    }

    function editToDo() {
        //Get Data from localStorage
        var localRecord = localStorage.getItem(this.key);
        var localItem = JSON.parse(localRecord);

        //Show form
        toggleDivs("off");

        //Populate Form with current record from localStorage
        //$$('groups').value = item.group[1];
        $$('firstname').value = localItem.firstName[1];
        $$('lastname').value = localItem.lastName[1];
        $$('toDoName').value = localItem.toDoName[1];
        $$('dtDue').value = localItem.dtDue[1];
        $$('assignedTo').value = localItem.assignedTo[1];
        $$('rngPriority').value = localItem.priority[1];
        $$('txtContent').value = localItem.content[1];
        if (localItem.sendEmail[1] == true) {
            $$('chkEmailAssignee').setAttribute("checked", "checked");
        }

        //Remove the initial listener from the input 'save contact' button.

        save.removeEventListener("click", storeToDo);
        //Change Submit Button Value to Edit Button
        $$('btnSubmit').value = "Edit To-Do";
        var editSubmit = $$('btnSubmit');
        //Save the key value established in this function as a property of the editSubmit event
        //so we can use that value when we save the data we edited.
        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
        
    }

    function validate(a) {
        //vars
        var getFirstName = $$('firstname');
        var getLastName = $$('lastname');
        var getToDoName = $$('toDoName');
        var getAssignedTo = $$('assignedTo');

        //Kill Old Errors
        errorList.innerHTML = "";
        getFirstName.style.border = "0px solid red";
        getLastName.style.border = "0px solid red";
        getAssignedTo.style.border = "0px solid red";
        getToDoName.style.border = "0px solid red";
        
        //Error Messages
        var messageArray = [];

        //FirstName Validation
        if (getFirstName.value == "") {
            var firstNameError = "First Name cannot be blank";
            getFirstName.style.border = "1px solid red";
            messageArray.push(firstNameError);
        }

        if (getLastName.value == "") {
            var lastNameError = "Last Name cannot be blank";
            getLastName.style.border = "1px solid red";
            messageArray.push(lastNameError);
        }

        //Assigned To Validation
        if (getAssignedTo.value == "--Choose Staff Member--") {
            var assignedToError = "You must assigned this to-do to someone.";
            getAssignedTo.style.border = "1px solid red";
            messageArray.push(assignedToError);
        }

        if (getToDoName.value == "") {
            var toDoNameError = "To-do Name cannot be blank";
            getToDoName.style.border = "1px solid red";
            messageArray.push(toDoNameError);
        }
        
        //Dispay Errors, if any
        if (messageArray.length >= 1) {
            for (var i = 0, j = messageArray.length; i < j; i++) {
                var txt = document.createElement('li');
                txt.innerHTML = messageArray[i];
                errorList.appendChild(txt);
            }
            a.preventDefault();
            return false;
        } else {
            //Store Data
            storeToDo(this.key);
        }
    }

    function clearLocal() {
        if(localStorage.length === 0){
            alert("There is no data to clear.");
        } else {
            localStorage.clear();
            alert("All to-do's are deleted!");
            window.location.reload();
            return false;
        }
    }

    //Set up list of people that we will be assigning to-do's to.
    var toDoAssignees = ["--Choose Staff Member--", "James Makowski", "Sarah Slegona", "Garrett Moore", "Josh Huffine", "Andrew Mund"];
    createAssigneeList();
    errorList = $$('errorList');

    //Set Link & Submit Click Events
    var displayLink = $$('linkDisplayData');
    displayLink.addEventListener("click", getToDos);
    var clearLink = $$('linkClearData');
    clearLink.addEventListener("click", clearLocal);
    var save = $$('btnSubmit');
    save.addEventListener("click", validate);
});