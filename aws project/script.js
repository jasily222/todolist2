// Task data storage (global arrays for tasks and completed tasks)
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');

// Function to render tasks on the tasks page
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return; // Ensure the element exists
    taskList.innerHTML = ''; // Clear existing tasks

    tasks.forEach(task => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => markTaskCompleted(task.id));

        const taskContent = `${task.name}`;
        const dueInfo = (task.dueDate || task.dueTime) ? ` (Due: ${task.dueDate || ''} ${task.dueTime || ''})` : '';
        li.textContent = taskContent + dueInfo;
        li.prepend(checkbox);
        taskList.appendChild(li);
    });
}

// Function to render completed tasks on the completed tasks page
function renderCompletedTasks() {
    const completedTaskList = document.getElementById('completed-task-list');
    if (!completedTaskList) return; // Ensure the element exists
    completedTaskList.innerHTML = ''; // Clear existing tasks

    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        completedTaskList.appendChild(li);
    });
}

// Function to add a new task
function addTask(event) {
    event.preventDefault();
    const taskNameInput = document.getElementById('task-name');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskPriorityInput = document.getElementById('task-priority');

    if (taskNameInput && taskNameInput.value.trim() !== '') {
        const newTask = {
            id: Date.now(),
            name: taskNameInput.value.trim(),
            completed: false,
            dueDate: taskDateInput && taskDateInput.value ? taskDateInput.value : null,
            dueTime: taskTimeInput && taskTimeInput.value ? taskTimeInput.value : null,
            priority: taskPriorityInput ? taskPriorityInput.value : 'low' // Default to low priority
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alert('Task added successfully!');
        taskNameInput.value = '';
        if (taskDateInput) taskDateInput.value = '';
        if (taskTimeInput) taskTimeInput.value = '';
        if (taskPriorityInput) taskPriorityInput.value = 'low';
        window.location.href = 'tasks.html'; // Navigate to tasks page
        updateStatistics(); // Update statistics after adding a task
    } else {
        alert('Please enter a task name.');
    }
}

// Function to mark a task as completed
function markTaskCompleted(taskId) {
    tasks = tasks.filter(task => {
        if (task.id === taskId) {
            task.completed = true;
            completedTasks.push(task); // Add to completed tasks
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks)); // Save to localStorage
            return false; // Remove from tasks
        }
        return true;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update tasks in localStorage
    renderTasks(); // Re-render tasks
    renderCompletedTasks(); // Re-render completed tasks
    updateStatistics(); // Update statistics
}

// Function to clear all completed tasks
function clearCompletedTasks() {
    if (confirm('Are you sure you want to clear all completed tasks?')) {
        completedTasks = []; // Clear the completed tasks array
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks)); // Update localStorage
        renderCompletedTasks(); // Re-render completed tasks
    }
}

// Function to update statistics on the statistics page
function updateStatistics() {
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksCountSpan = document.getElementById('completed-tasks-count');
    const pendingTasksSpan = document.getElementById('pending-tasks');

    const totalTasks = tasks.length + completedTasks.length;
    const completedTasksCount = completedTasks.length;
    const pendingTasks = tasks.length;

    if (totalTasksSpan) totalTasksSpan.textContent = totalTasks.toString();
    if (completedTasksCountSpan) completedTasksCountSpan.textContent = completedTasksCount.toString();
    if (pendingTasksSpan) pendingTasksSpan.textContent = pendingTasks.toString();
}

// Profile editing functionality
document.addEventListener('DOMContentLoaded', () => {
    const editProfileButton = document.getElementById('edit-profile-button');
    const editProfileForm = document.getElementById('edit-profile-form');
    const profileInfo = document.getElementById('profile-info');
    const profileNameSpan = document.getElementById('profile-name');
    const profileEmailSpan = document.getElementById('profile-email');

    if (editProfileButton) {
        editProfileButton.addEventListener('click', () => {
            editProfileForm.style.display = 'block';
            profileInfo.style.display = 'none';
            const nameInput = document.getElementById('new-name');
            const emailInput = document.getElementById('new-email');
            if (nameInput && emailInput && profileNameSpan && profileEmailSpan) {
                nameInput.value = profileNameSpan.textContent;
                emailInput.value = profileEmailSpan.textContent;
            }
        });
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newName = document.getElementById('new-name').value;
            const newEmail = document.getElementById('new-email').value;
            if (newName && newEmail) {
                if (profileNameSpan) profileNameSpan.textContent = newName;
                if (profileEmailSpan) profileEmailSpan.textContent = newEmail;

                localStorage.setItem('profileName', newName);
                localStorage.setItem('profileEmail', newEmail);

                alert('Profile updated successfully!');
                editProfileForm.style.display = 'none';
                profileInfo.style.display = 'block';
            } else {
                alert('Please fill out all fields.');
            }
        });
    }

    const savedName = localStorage.getItem('profileName');
    const savedEmail = localStorage.getItem('profileEmail');
    if (savedName && profileNameSpan) profileNameSpan.textContent = savedName;
    if (savedEmail && profileEmailSpan) profileEmailSpan.textContent = savedEmail;
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeSelect.value = 'light';
    } else {
        body.classList.remove('light-mode');
        themeSelect.value = 'dark';
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const selectedTheme = themeSelect.value;
            if (selectedTheme === 'light') {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
            }
            localStorage.setItem('theme', selectedTheme);
        });
    }
});

// FAQ toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
});

// Initial rendering and event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderTasks(); // Render tasks on tasks.html
    renderCompletedTasks(); // Render completed tasks on completed-tasks.html
    updateStatistics(); // Update statistics on statistics.html

    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', addTask);
    }

    const clearButton = document.getElementById('clear-completed-tasks');
    if (clearButton) {
        clearButton.addEventListener('click', clearCompletedTasks);
    }
});
