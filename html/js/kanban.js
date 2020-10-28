// Dragdrop Tasks
// Compare to "https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event"
{ // Hide
    let dragged;

    document.addEventListener("drag", function (event) {

    }), false;

// On drag start
    document.addEventListener("dragstart", function (event) {
        // referenece the dragged element on drag start
        if (event.target.className.includes("handle")) {
            dragged = event.target.parentNode;
        }

        // For making it sortable
        if (event.target.className === "handle") {
            dragStart(event);
        }
    }, false);

// On drag end
    document.addEventListener("dragend", function (event) {

    }, false);

// On drag over
    document.addEventListener("dragover", function (event) {
        event.preventDefault();

        // For making it sortable
        if (event.target.className === "task-card") {
            dragOver(event);
        }
    }, false);

// On entering the dropzone
    document.addEventListener("dragenter", function (event) {
        // highlight target
        if (event.target.className === "column dropzone" && event.target !== dragged.parentNode) {
            event.target.style.background = "rgb(160, 114, 83)";
        }
    }, false);

// On leaving the dropzone
    document.addEventListener("dragleave", function (event) {
        // reset highlight on target
        if (event.target.className === "column dropzone") {
            event.target.style.background = "";
        }
    }, false);

// On drop
    document.addEventListener("drop", function (event) {
        // prevent default action
        event.preventDefault();

        // move the dragged element to the dropzone
        if (event.target.className === "column dropzone") {
            event.target.style.background = "";

            // Select the "Create a new task.."-node
            let lastChild = event.target.lastChild.previousSibling;

            // Remove element from former parent
            dragged.parentNode.removeChild(dragged);
            // Add element as child of target
            event.target.appendChild(dragged);

            // Place the "Create a new task.."-node as last element
            lastChild.parentNode.removeChild(lastChild);
            event.target.appendChild(lastChild);

            updateTaskCard(toJSON(dragged));
        }

    }, false);
}
// Functions to make the task-cards orderable
// Compare to https://stackoverflow.com/questions/10588607/tutorial-for-html5-dragdrop-sortable-list
{ // Hide
    let el;

    function dragOver(event) {
        if (isBefore(el, event.target)) {
            event.target.parentNode.insertBefore(el, event.target);
            event.target.parentNode.style.background = "rgb(160, 114, 83)";
        } else {
            event.target.parentNode.insertBefore(el, event.target.nextSibling);
            event.target.parentNode.style.background = "rgb(160, 114, 83)";
        }
    }

    function dragStart(event) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", null);
        el = event.target;
    }

    function isBefore(el1, el2) {
        if (el2.parentNode === el1.parentNode) {
            for (let cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling) {
                if (cur === el2) {
                    return true;
                }
            }
        }
        return false;
    }
}
// Functions to create a new task-card
{ // HIde
    function openCreateNewTask() {
        document.getElementById("newCardForm").style.display = "block";
        createNewTask();
    }

    function closeCreateNewTask() {
        document.getElementById("newCardForm").style.display = "none";
    }

// Compare to https://stackoverflow.com/questions/7410063/how-can-i-listen-to-the-form-submit-event-in-javascript
    function createNewTask() {
        let crTask = document.getElementById("newTask");
        crTask.onsubmit = submitted.bind(crTask);
        console.log(crTask);
    }
    /*
    function deleteSelectedTask() {
        let crTask = document.getElementById("newTask");
        crTask.onsubmit = submitted.bind(crTask);
        console.log(crTask);
    }

     */

    function submitted(event) {
        event.preventDefault();
        console.log("submitted");
        closeCreateNewTask();
    }

    const newTaskForm = document.querySelector("#newTask");

    newTaskForm.addEventListener("submit", (e) => {
        const values = Object.fromEntries(new FormData(e.target));
        values.project = document.querySelector("#project-name").textContent;

        fetch("/taskcard", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "content-type": "application/json",
            }
        }).then(res => res.json()).then(data => {
            console.log(data);

            generateTaskCard("to-do", data.priority, data.taskname, data.editorname, data.duedate, data._id)
        });

        console.log("FORM SUBMITTED", values);
    })
}
// Functions to edit task-description
{ // Hide
    function openEditNewTask(event) {
        console.log(event);
        let card = event.parentNode.parentNode;
        console.log(card);
        console.log(toJSON(card));

        const editForm = document.querySelector("#editCardForm");
        console.log(editForm);

        editForm.style.display = "block";
    }

    function deleteTask(event) {
        console.log(event);
        let card = event.parentNode.parentNode;
        console.log(card);
        console.log(toJSON(card));

        const deleteForm = document.querySelector("#deleteCardForm");
        console.log(deleteForm);

        deleteForm.style.display = "block";
    }

    function closeEditNewTask() {
        document.getElementById("editCardForm").style.display = "none";
    }
}

// Function to generate the dom element for a task card
function generateTaskCard(column, priority, taskname, editorname, duedate, id) {
    // Get the column to which to append the taskcard
    const targetColumn = document.querySelector("#" + column);

    // Creates the whole card division
    let card = document.createElement("div");
    card.className = "card";

    // Creates the edit and delete division
    let editsection = document.createElement("div");
    editsection.className = "editsection";

    // Create the handle for the card
    let handle = document.createElement("div");
    if (priority === "low") {
        handle.className = "handle low";
    }
    if (priority === "medium") {
        handle.className = "handle medium";
    }
    if (priority === "high") {
        handle.className = "handle high";
    }
    handle.setAttribute("draggable", "true");
    card.appendChild(handle);

    // Create the content division
    let content = document.createElement("div");
    content.className = "content";

    // Creates the header with the title
    let title = document.createElement("h5");
    title.textContent = taskname;
    content.appendChild(title);

    // Add the editor name to the content division
    let editor = document.createElement("p");
    editor.textContent = editorname;
    content.appendChild(editor);

    // Add the due date to the content division
    let dueDate = document.createElement("p");
    let date = duedate.substr(8, 2) + "." + duedate.substr(5, 2) + "." + duedate.substr(0, 4);
    dueDate.textContent = date;
    content.appendChild(dueDate);

    card.appendChild(content);

    // Create the edit button
    let edit = document.createElement("button");
    edit.className = "edit";
    edit.setAttribute("onclick", "openEditNewTask(this)");

    // Create the image for the edit button
    let img = document.createElement("img");
    img.setAttribute("src", "img/icons8-edit.svg");

    edit.appendChild(img);

    card.appendChild(edit);


    // Create the kill button
    let kill = document.createElement("button");
    let editKill = document.createElement("div");
    kill.className = "kill";
    kill.setAttribute("onclick", "openEditNewTask(this)");

    // Create the image for the kill button
    let killImg = document.createElement("img");
    killImg.setAttribute("src", "img/icons8-delete.svg");

    kill.appendChild(killImg);
    editsection.appendChild(edit);
    editsection.appendChild(kill);


    card.appendChild(editsection);

    // Create the hidden id field for the task
    let idField = document.createElement("p");
    idField.className = "invisible";
    idField.textContent = id;
    card.appendChild(idField);

    // Create the hidden date field for the task
    let dateField = document.createElement("p");
    dateField.className = "invisible";
    dateField.textContent = duedate;
    card.appendChild(dateField);


    targetColumn.appendChild(card);
}

// Update function
function updateTaskCard(cardJSON) {
    fetch("/taskcard", {
        method: "PUT",
        body: JSON.stringify(cardJSON),
        headers: {
            "content-type": "application/json",
        }
    }).then(res => res.json()).then(data => {

    });

    console.log("TASKCARD UPDATED");
}

// Generete JSON from taskcard(html)
function toJSON(draggedElement) {
    console.log(draggedElement);
    let cardJson = {
        _id: draggedElement.childNodes[3].textContent,
        project: document.querySelector('#project-name').textContent,
        column: draggedElement.parentNode.id,
        position: null,
        taskname: draggedElement.childNodes[1].childNodes[0].textContent,
        editorname: draggedElement.childNodes[1].childNodes[1].textContent,
        duedate: draggedElement.childNodes[4].textContent,
        priority: draggedElement.childNodes[0].className.substr(7, 6).trim()
    }

    return cardJson;
}

// Initializing the page and filling it with the given data
function initialize() {

    const projectName = document.querySelector("#project-name").textContent;


    fetch("/project/" + projectName).then(res => res.json()).then(data => {
        // TODO: replace "to-do" with card.column
        data.forEach(card => {
            if(card.column === null){
                generateTaskCard("to-do", card.priority, card.taskname, card.editorname, card.duedate, card._id);
            } else {
                generateTaskCard(card.column, card.priority, card.taskname, card.editorname, card.duedate, card._id);
            }
        });
    });

    console.log("PROJECT PAGE INITIALIZED!");
}