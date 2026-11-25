
// Get elements from the HTML page
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter-btn");

// Load saved tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Store the current filter
let currentFilter = "all";

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {

    const taskText = taskInput.value.trim();

    // Check if input is empty
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create a task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add task to the array
    tasks.push(newTask);

    // Save and display tasks
    saveTasks();
    renderTasks();

    // Clear the input box
    taskInput.value = "";
}

// Display tasks on the webpage
function renderTasks() {

    // Clear the current list
    taskList.innerHTML = "";

    // Filter tasks based on selected filter
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Display message if there are no tasks
    if (filteredTasks.length === 0) {

        const message = document.createElement("li");
        message.classList.add("empty-message");

        if (currentFilter === "active") {
            message.textContent = "No active tasks.";
        }
        else if (currentFilter === "completed") {
            message.textContent = "No completed tasks yet.";
        }
        else {
            message.textContent = "Your tasks will appear here.";
        }

        taskList.appendChild(message);
    }

    // Display each task
    filteredTasks.forEach(function(task) {

        // Create list item
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Create task text
        const taskTextElement = document.createElement("span");
        taskTextElement.textContent = task.text;

        // Create Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        // Edit task
        editButton.addEventListener("click", function() {

            if (editButton.textContent === "Edit") {

                // Create an input box for editing
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = task.text;
                editInput.classList.add("edit-input");

                // Replace task text with input box
                listItem.replaceChild(editInput, taskTextElement);

                editButton.textContent = "Save";

                editInput.focus();

            } else {

                // Get the edited text
                const editInput = listItem.querySelector(".edit-input");
                const updatedTask = editInput.value.trim();

                if (updatedTask === "") {
                    alert("Task cannot be empty!");
                    return;
                }

                // Update the task
                task.text = updatedTask;

                saveTasks();
                renderTasks();
            }
        });

        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        // Delete task
        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        // Mark task as completed
        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
        });

        // Add elements to list item
        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextElement);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        // Add list item to task list
        taskList.appendChild(listItem);

    });

    // Update task summary
    updateTaskCount();
}

// Update remaining and completed task counts
function updateTaskCount() {

    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    const finishedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    taskCount.textContent =
        remainingTasks + (remainingTasks === 1
            ? " task remaining"
            : " tasks remaining");

    completedCount.textContent =
        finishedTasks + (finishedTasks === 1
            ? " completed"
            : " completed");
}

// Add task when Add button is clicked
addButton.addEventListener("click", addTask);

// Add task when Enter key is pressed
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }
});

// Filter buttons
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Set the selected filter
        currentFilter = button.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Highlight selected button
        button.classList.add("active");

        // Display filtered tasks
        renderTasks();
    });
});

// Display saved tasks when page loads
renderTasks();
