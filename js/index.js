// Made by ITSKQW7 on GitHub
console.log("Background service has started.");

// Variables
const addButton = document.getElementById("add-button");
const taskInput = document.getElementById("title-input");
const informationButton = document.getElementById("information-button");
const informationContainer = document.getElementById("information-container");
const closeInformationContainerButton = document.getElementById("close-button");

const container = document.getElementById("container");

const toast = document.getElementById("toast")

// Detect if the user is on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log(isMobile);

if (isMobile) {
    taskInput.placeholder = "Press enter to add task";
}

informationButton.addEventListener("click", () => {
    informationContainer.showModal();
    informationButton.style.display = 'none'; // Hide the button
});

closeInformationContainerButton.addEventListener("click", () => {
    informationContainer.close();
    informationButton.style.display = 'block'; // Show the button
});

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
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

function createTask(itemContent, selectState) {
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

    // Create select element
    var selectElement = document.createElement("select");
    selectElement.className = "time";
    selectElement.id = "time-select";

    // Create options
    var option1 = document.createElement("option");
    option1.value = "sooner";
    option1.text = "Sooner";
    selectElement.appendChild(option1);

    var option2 = document.createElement("option");
    option2.value = "later";
    option2.text = "Later";
    selectElement.appendChild(option2);

    // Append select element to task container
    taskContainer.appendChild(selectElement);

    var lineBreak = document.createElement("br");
    taskItemContainer.appendChild(lineBreak);

    taskContainer.appendChild(taskItemContainer);
    document.body.appendChild(taskContainer);

    selectElement.value = selectState || "sooner";

    // Save task-state pair in cookies
    selectElement.addEventListener("change", function () {
        var taskStatePairs = JSON.parse(getCookie("taskStatePairs") || "{}");
        taskStatePairs[itemContent] = selectElement.value;
        setCookie("taskStatePairs", JSON.stringify(taskStatePairs), 30);
    });

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

            // Remove task-state pair from cookies
            var taskStatePairs = JSON.parse(getCookie("taskStatePairs") || "{}");
            delete taskStatePairs[itemContent];
            setCookie("taskStatePairs", JSON.stringify(taskStatePairs), 30);
        }
    });
}

function addTask() {
    var itemContent = taskInput.value;

    if (itemContent.trim() === "") {
        showToast("❌", "Please enter a task.")
        return;
    }

    createTask(itemContent, "sooner"); // Default select state is "sooner"

    // Store task in cookies
    var tasks = getCookie("tasks");
    tasks = tasks ? tasks.split(",") : [];
    tasks.push(itemContent);
    setCookie("tasks", tasks.join(","), 30);

    // Store task-state pair in cookies
    var taskStatePairs = JSON.parse(getCookie("taskStatePairs") || "{}");
    taskStatePairs[itemContent] = "sooner";
    setCookie("taskStatePairs", JSON.stringify(taskStatePairs), 30);

    taskInput.value = "";
}

function loadTasks() {
    var tasks = getCookie("tasks");
    var taskStatePairs = JSON.parse(getCookie("taskStatePairs") || "{}");
    tasks = tasks ? tasks.split(",") : [];
    for (var i = 0; i < tasks.length; i++) {
        createTask(tasks[i], taskStatePairs[tasks[i]]);
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
