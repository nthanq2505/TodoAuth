const StateOfFilterTasks = Object.freeze({
  ALL: "all",
  DONE: "done",
  NOT_DONE: "not_done",
});

const ApiRoot = "http://localhost:3000";

function TaskManager(tasks = []) {
  this.tasks = tasks;
  this.currentTaskIndex = null;
  this.currentFilter = StateOfFilterTasks.ALL;

  this.taskList = document.querySelector(".list__task");
  this.addButton = document.querySelector(".add__button");
  this.clearButton = document.querySelector(".clear__button");
  this.saveButtons = document.querySelector(".save-modal");
  this.cancelButtons = document.querySelector(".cancel-modal");
  this.edit_task = document.querySelector(".modal");
  this.filterInput = document.querySelector("#filter");

  this.addButton.onclick = this.addTask.bind(this);
  this.clearButton.onclick = this.clearAdd.bind(this);
  this.saveButtons.onclick = this.saveEdit.bind(this);
  this.cancelButtons.onclick = this.cancelEdit.bind(this);
  this.filterInput.onchange = this.filterTasks.bind(this);

  this.renderTasks();
  this.saveTasks();
}

TaskManager.prototype.addTask = function () {
  const taskNameInput = document.querySelector(".add__input");
  const taskName = taskNameInput.value;

  if (taskName) {
    if (this.currentFilter === StateOfFilterTasks.DONE) {
      this.currentFilter = StateOfFilterTasks.ALL;
      this.filterInput.value = StateOfFilterTasks.ALL;
    }
    this.tasks.push({ name: taskName, isDone: false });
    taskNameInput.value = "";
    this.arrangeTaskList();
    this.renderTasks();
    this.saveTasks();
  }
};

TaskManager.prototype.clearAdd = function () {
  document.querySelector(".add__input").value = "";
};

TaskManager.prototype.deleteTask = function (index) {
  this.tasks.splice(index, 1);
  this.renderTasks();
  this.saveTasks();
};

TaskManager.prototype.editTask = function (index) {
  this.currentTaskIndex = index;
  const editInput = document.querySelector(".edit__input");
  editInput.value = this.tasks[index].name;
  this.edit_task.classList.add("open");
};

TaskManager.prototype.saveEdit = function () {
  const newName = document.querySelector(".edit__input").value;
  this.edit_task.classList.remove("open");
  if (newName) {
    this.tasks[this.currentTaskIndex].name = newName;
    this.renderTasks();
    this.saveTasks();
  }
};

TaskManager.prototype.cancelEdit = function () {
  this.edit_task.classList.remove("open");
};

TaskManager.prototype.arrangeTaskList = function () {
  this.tasks.sort((a, b) => {
    if (a.isDone && !b.isDone) return 1;
    if (!a.isDone && b.isDone) return -1;
    return 0;
  });
};

TaskManager.prototype.toggleTask = function (index) {
  this.tasks[index].isDone = !this.tasks[index].isDone;
  this.arrangeTaskList();
  this.renderTasks();
  this.saveTasks();
};

TaskManager.prototype.filterTasks = function () {
  this.currentFilter = this.filterInput.value;
  this.renderTasks();
};

TaskManager.prototype.renderTasks = function () {
  this.taskList.innerHTML = "";

  const filteredTasks = this.tasks.filter((task) => {
    if (this.currentFilter === StateOfFilterTasks.ALL) {
      return true;
    } else if (this.currentFilter === StateOfFilterTasks.DONE) {
      return task.isDone;
    } else {
      return !task.isDone;
    }
  });

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
            <input class="check-box" type="checkbox" ${
              task.isDone ? "checked" : ""
            } onclick="taskManager.toggleTask(${index})">
            <span>${task.name}</span>
            <button onclick="taskManager.editTask(${index})">Edit</button>
            <button class="red-button" onclick="taskManager.deleteTask(${index})">Delete</button>
        `;
    this.taskList.appendChild(taskItem);
  });
};

TaskManager.prototype.saveTasks = function () {
  const user =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));
  user.tasks = this.tasks;
  if (localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }

  const users = JSON.parse(localStorage.getItem("users"));
  const index = users.findIndex(
    (currentUser) => currentUser.username === user.username
  );
  users[index] = user;
  localStorage.setItem("users", JSON.stringify(users));
};

function logout() {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function handleLogin() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const remember = document.querySelector("#remember").checked;
  /* TODO APP with localstorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  
    const isUserExisted = users.some(user => user.username === username);
    if (!isUserExisted) {
        alert('Username does not exist');
        return;
    }
    if (users.some(user => user.username === username && user.password !== password)) {
        alert('Password is incorrect');
        return;
    }
    const currentUser = users.find(user => user.username === username);
    if (remember) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    */
  try {
    fetch(`${ApiRoot}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(async (response) => {
      const data = await response.json();
      console.log(data);
        localStorage.setItem("currentUser", data.username);
        window.location.href = "index.html";
    });
  } catch (error) {
    alert("Login failed. Please try again.");
  }
}

function handleRegister() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const repeatPassword = document.querySelector("#repeat-password").value;
  /* TODO APP with localstorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const isUserExisted = users.some((user) => user.username === username);
  if (isUserExisted) {
    alert("Username is already existed");
    return;
  }
  if (password !== repeatPassword) {
    alert("Password does not match");
    return;
  }
  users.push({ username, password, tasks: [] });
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "login.html";
  */

  if (password !== repeatPassword) {
    alert("Password does not match");
    return;
  }

  try {
    fetch(`${ApiRoot}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      localStorage.setItem("user", response);
      window.location.href = "index.html";
    });
  } catch (error) {
    alert("Register failed. Please try again.");
  }
}

window.onload = function () {
  const localUser = localStorage.getItem("currentUser");
  const sessionUser = sessionStorage.getItem("currentUser");
  const currentWindow = window.location.href.split("/").pop();

  if (localUser || sessionUser) {
    if (
      currentWindow === "login.html" ||
      currentWindow === "register.html" ||
      currentWindow === ""
    ) {
      window.location.href = "index.html";
    }
  } else {
    if (currentWindow === "index.html" || currentWindow === "") {
      window.location.href = "login.html";
    }
  }
};
const username = document.querySelector(".username");
const user = localStorage.getItem("currentUser")
// const taskManager = new TaskManager(user.tasks);

if (window.location.href.split("/").pop() === "index.html") {
  username.innerHTML = `
        <p>Hello, ${user}</p>
        <button class="red-button logout-button" onclick="logout()">Logout</button>
    `;
}
