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

            updateTaskCard(dragged, toJSON(dragged));
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
    }

    function submitted(event) {
        event.preventDefault();
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
            generateTaskCard("to-do", data.priority, data.taskname, data.editorname, data.duedate, data._id)
        });
    })
}
// Functions to edit task-description
{ // Hide
    let card;

    function openEditNewTask(event) {
        card = event.parentNode.parentNode;
        let cardJson = toJSON(card);
        document.getElementById("nameChange").value = cardJson.taskname;
        document.getElementById("editorChange").value = cardJson.editorname;
        document.getElementById("dateChange").value = cardJson.duedate;
        document.getElementById("prioChange").value = cardJson.priority;
        document.getElementById("editCardForm").style.display = "block";
    }

    const editForm = document.querySelector("#editTask");

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = Object.fromEntries(new FormData(e.target));
        let mappedCard = cardValueMapping(toJSON(card), values);
        updateTaskCard(card, mappedCard);
    });

    function deleteTask(event) {
        card = event.parentNode.parentNode;
        fetch("/taskcard", {
            method: "DELETE",
            body: JSON.stringify(toJSON(card)),
            headers: {
                "content-type": "application/json",
            }
        }).then(res => {
            card.remove();
        })


    }

    function closeEditNewTask() {
        document.getElementById("editCardForm").style.display = "none";
    }
}

// Function to generate the dom element for a task card
function generateTaskCard(column, priority, taskname, editorname, duedate, id, description) {
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
    handle.textContent = "Grab here to drag!"
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
    kill.setAttribute("onclick", "deleteTask(this)");

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

// Update card function
function updateContent(card, content) {
    card.childNodes[1].childNodes[0].textContent = content.taskname;
    card.childNodes[1].childNodes[1].textContent = content.editorname;
    card.childNodes[1].childNodes[2].textContent = content.duedate.substr(8, 2) + "."
        + content.duedate.substr(5, 2) + "." + content.duedate.substr(0, 4);
    card.childNodes[4].textContent = content.duedate;
    if (content.priority === "low") {
        card.childNodes[0].className = "handle low";
    }
    if (content.priority === "medium") {
        card.childNodes[0].className = "handle medium";
    }
    if (content.priority === "high") {
        card.childNodes[0].className = "handle high";
    }
}

// Function to map the values from the form into the card json
function cardValueMapping(cardJson, formInput) {
    cardJson.taskname = formInput.taskname;
    cardJson.editorname = formInput.editorname;
    cardJson.duedate = formInput.duedate;
    cardJson.priority = formInput.priority;

    return cardJson;
}

// Update function
function updateTaskCard(card, cardJSON) {
    fetch("/taskcard", {
        method: "PUT",
        body: JSON.stringify(cardJSON),
        headers: {
            "content-type": "application/json",
        }
    }).then(res => res.json()).then(data => {
        updateContent(card, data);
        closeEditNewTask();
    });

}

// Generete JSON from taskcard(html)
function toJSON(card) {
    let cardJson = {
        _id: card.childNodes[3].textContent,
        project: document.querySelector('#project-name').textContent,
        column: card.parentNode.id,
        position: null,
        taskname: card.childNodes[1].childNodes[0].textContent,
        editorname: card.childNodes[1].childNodes[1].textContent,
        duedate: parseDate(card.childNodes[1].childNodes[2].textContent),
        priority: card.childNodes[0].className.substr(7, 6).trim()
    }

    return cardJson;
}

function parseDate(date) {
    let parsedDate = date.substr(6, 4) + "-" + date.substr(3, 2) + "-" + date.substr(0, 2);
    return parsedDate;
}

// Initializing the page and filling it with the given data
function initialize() {


    const projectName = new URLSearchParams(window.location.search).get("projectname");
    document.querySelector("#project-name").textContent = projectName;

    if (sessionStorage.getItem('project') === projectName) {

        fetch("/taskcard/" + projectName).then(res => res.json()).then(data => {
            // TODO: replace "to-do" with card.column
            data.forEach(card => {
                if (card.column === null) {
                    generateTaskCard("to-do", card.priority, card.taskname, card.editorname, card.duedate, card._id);
                } else {
                    generateTaskCard(card.column, card.priority, card.taskname, card.editorname, card.duedate, card._id);
                }
            });
        });
    } else {
    location.href = "index.html";
    }
}


function logout() {
    sessionStorage.clear();}