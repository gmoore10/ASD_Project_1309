function (doc) {
	if(doc.type === "todo") {
		emit(doc._id, {
			"toDoName": doc.toDoName,
			"dtDue": doc.dtDue,
			"firstName": doc.firstName,
			"lastName": doc.lastName,
			"assignedTo": doc.assignedTo,
			"priority": doc.priority,
			"emailTaskReceiver": doc.emailTaskReceiver,
			"content": doc.content,
		});
	}
};