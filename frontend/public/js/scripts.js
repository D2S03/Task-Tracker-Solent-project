document.addEventListener("DOMContentLoaded", function() {
  const taskForm = document.getElementById("taskForm");
  const tasksContainer = document.getElementById("tasks");
  const submitButton = taskForm.querySelector("button[type='submit']");
  let isEditing = false;
  let currentTaskId = null;

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:5001/api/tasks");
      const tasks = await response.json();
      tasksContainer.innerHTML = ""; // Clear the container
      tasks.forEach(task => {
        appendTask(task);
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  function appendTask(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task"); // Add the task class
    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Status: ${task.status}</p>
      <p>Created At: ${new Date(task.createdAt).toLocaleString()}</p>
      <button onclick="deleteTask('${task._id}')">Delete</button>
      <button onclick="editTask('${task._id}')">Edit</button>
    `;
    tasksContainer.prepend(taskElement); // Prepend to the container
  }

  taskForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const taskData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      status: document.getElementById("status").value
    };

    if (isEditing) {
      await updateTask(currentTaskId, taskData);
    } else {
      await createTask(taskData);
    }

    taskForm.reset();
    submitButton.textContent = "Add Task";
    isEditing = false;
    currentTaskId = null;
  });

  async function createTask(newTask) {
    try {
      const response = await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });

      const task = await response.json();
      appendTask(task);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }

  async function updateTask(id, updatedTask) {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
      });

      fetchTasks(); // Refresh the task list
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }

  window.editTask = async function(id) {
    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${id}`);
      const task = await response.json();

      // Populate the form with the current task details
      document.getElementById("title").value = task.title;
      document.getElementById("description").value = task.description;
      document.getElementById("status").value = task.status;

      // Set the form to edit mode
      isEditing = true;
      currentTaskId = id;
      submitButton.textContent = "Update Task";
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  };

  window.deleteTask = async function(id) {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "DELETE"
      });

      fetchTasks(); // Refresh the task list
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  fetchTasks();
});
