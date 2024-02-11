// Made by KQW7
console.log("Background service has started.");

// Variables
const addButton = document.getElementById("add-button");
const taskInput = document.getElementById("title-input");

const container = document.getElementById("container");
const taskContainer = document.getElementById("task-container");

const toast = document.getElementById("toast")

// Functions
let toastTimeout;

function showToast(emoji, text) {
    toast.innerHTML = `${emoji} ${text}`;
    toast.style.display = 'block';

    // Clear previous timeout if exists
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Set new timeout
    toastTimeout = setTimeout(function() {
        toast.innerHTML = '';
        toast.style.display = 'none';
    }, 3000);
}


function addTask() {
    var itemContent = taskInput.value;

    if (itemContent.trim() === "") {
        showToast("❌", "Please enter a task.")
        return;
    }

    var taskItemContainer = document.createElement("div");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    taskItemContainer.appendChild(checkbox);

    var textNode = document.createTextNode(itemContent);
    taskItemContainer.appendChild(textNode);

    var lineBreak = document.createElement("br");
    taskItemContainer.appendChild(lineBreak);

    taskContainer.appendChild(taskItemContainer);
    taskInput.value = "";

    checkbox.addEventListener("change", function() {
        if (this.checked) {
            taskContainer.removeChild(taskItemContainer);
            showToast("✅", "Completed task!")
        }
    });
}

// Call functions
addButton.addEventListener("click", () => {
    addTask()
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask()
    }
});