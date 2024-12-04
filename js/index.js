import { TaskManager } from './taskManager.js';

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function handleLogin() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const remember = document.querySelector('#remember').checked;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
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
    window.location.href = 'index.html';
}

function handleRegister() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const repeatPassword = document.querySelector('#repeat-password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserExisted = users.some(user => user.username === username);

    if (isUserExisted) {
        alert('Username is already existed');
        return;
    }

    if (password !== repeatPassword) {
        alert('Password does not match');
        return;
    }
    
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = 'login.html';
}

window.onload = function () {
    const localUser = localStorage.getItem('currentUser');
    const sessionUser = sessionStorage.getItem('currentUser');
    const currentWindow = window.location.href.split('/').pop();

    if (localUser || sessionUser) {
        if (currentWindow === 'login.html' || currentWindow === 'register.html' || currentWindow === '') {
            window.location.href = 'index.html';
        }
    } else {
        if (currentWindow === 'index.html' || currentWindow === '') {
            window.location.href = 'login.html';
        }
    }
}

const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
const userTasks = allTasks.filter(task => task.owner === user.username);

const username = document.querySelector('.username');
if (window.location.href.split('/').pop() === 'index.html') {
    const taskManager = new TaskManager(userTasks);
    username.innerHTML = `
        <p>Hello, ${user.username}</p>
        <button class="red-button logout-button">Logout</button>
    `
}

const loginButton = document.querySelector('.login-button');
if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
}

const registerButton = document.querySelector('.register-button');
if (registerButton) {
    registerButton.addEventListener('click', handleRegister);
}

const logoutButton = document.querySelector('.logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}