// Made by KQW7
console.log("Background service has started.");

// Variables
const addButton = document.getElementById("add-button");
const taskInput = document.getElementById("title-input");

const container = document.getElementById("container");

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
    toastTimeout = setTimeout(function () {
        toast.innerHTML = '';
        toast.style.display = 'none';
    }, 3000);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function createTask(itemContent) {
    var taskContainer = document.createElement("div");
    taskContainer.className = "task_container";

    var taskItemContainer = document.createElement("label"); 
    taskItemContainer.className = "checkbox-container";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    taskItemContainer.appendChild(checkbox);

    var textNode = document.createTextNode(itemContent);
    textNode.className = "task-text"; // Add the class to the text node
    taskItemContainer.appendChild(textNode);

    var lineBreak = document.createElement("br");
    taskItemContainer.appendChild(lineBreak);

    taskContainer.appendChild(taskItemContainer);
    document.body.appendChild(taskContainer); 

    checkbox.addEventListener("change", function () {
        if (this.checked) {
            document.body.removeChild(taskContainer); 
            showToast("✅", "Completed task!")

            // Remove task from cookies
            var tasks = getCookie("tasks").split(",");
            var index = tasks.indexOf(itemContent);
            if (index > -1) {
                tasks.splice(index, 1);
            }
            setCookie("tasks", tasks.join(","), 30);
        }
    });
}

function addTask() {
    var itemContent = taskInput.value;

    if (itemContent.trim() === "") {
        showToast("❌", "Please enter a task.")
        return;
    }

    createTask(itemContent);

    // Store task in cookies
    var tasks = getCookie("tasks");
    tasks = tasks ? tasks.split(",") : [];
    tasks.push(itemContent);
    setCookie("tasks", tasks.join(","), 30);

    taskInput.value = "";
}

function loadTasks() {
    var tasks = getCookie("tasks");
    tasks = tasks ? tasks.split(",") : [];
    for (var i = 0; i < tasks.length; i++) {
        createTask(tasks[i]);
    }
}

loadTasks();

// Call functions
addButton.addEventListener("click", () => {
    addTask()
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask()
    }
});