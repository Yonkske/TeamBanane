// Dragdrop Tasks
// Compare to "https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event"

let dragged;

document.addEventListener("drag", function(event) {

}), false;

// On drag start
document.addEventListener("dragstart", function(event) {
    // referenece the dragged element on drag start
    dragged = event.target;

    // For making it sortable
    if(event.target.className == "task-card") {
        dragStart(event);
    }
}, false);

// On drag end
document.addEventListener("dragend", function(event) {

}, false);

// On drag over
document.addEventListener("dragover", function(event) {
    event.preventDefault();

    // For making it sortable
    if(event.target.className == "task-card") {
        dragOver(event);
    }
}, false);

// On entering the dropzone
document.addEventListener("dragenter", function(event) {
    // highlight target
    if(event.target.className == "column dropzone" && event.target != dragged.parentNode) {
        event.target.style.background = "rgb(160, 114, 83)";
    }
}, false);

// On leaving the dropzone
document.addEventListener("dragleave", function(event) {
    // reset highlight on target
    if(event.target.className == "column dropzone") {
        event.target.style.background = "";
    }
}, false);

// On drop
document.addEventListener("drop", function(event) {
    // prevent default action
    event.preventDefault();
    
    // move the dragged element to the dropzone
    if(event.target.className == "column dropzone") {
        event.target.style.background = "";

        // Select the "Create a new task.."-node
        let lastChild  = event.target.lastChild.previousSibling;

        // Remove element from former parent
        dragged.parentNode.removeChild(dragged);      
        // Add element as child of target
        event.target.appendChild(dragged);

        // Place the "Create a new task.."-node as last element
        lastChild.parentNode.removeChild(lastChild);
        event.target.appendChild(lastChild);
    }

}, false);

// Functions to make the task-cards orderable
// Compare to https://stackoverflow.com/questions/10588607/tutorial-for-html5-dragdrop-sortable-list

let el;

function dragOver(event) {
    if (isBefore(el, event.target)){
        event.target.parentNode.insertBefore(el, event.target);
        event.target.parentNode.style.background = "rgb(160, 114, 83)";
    }
    else {
        event.target.parentNode.insertBefore(el, event.target.nextSibling);
        event.target.parentNode.style.background = "rgb(160, 114, 83)";
    }
};

function dragStart(event) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", null); // Thanks to bqlou for their comment.
    el = event.target;
};

function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode) {
        for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling) {
            if (cur === el2) {
                return true;
            }
        }
    }
  return false;
};