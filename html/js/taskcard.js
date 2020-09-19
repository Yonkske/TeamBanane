// Dragdrop Tasks
// Compare to "https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event"

let dragged;

document.addEventListener("drag", function(event) {

}), false;

// On drag start
document.addEventListener("dragstart", function(event) {
    // referenece the dragged element on drag start
    dragged = event.target;
}, false);

// On drag end
document.addEventListener("dragend", function(event) {

}, false);

// On drag over
document.addEventListener("dragover", function(event) {
    event.preventDefault();
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

