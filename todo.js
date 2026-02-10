let addTask = document.getElementById('todo');
let container = document.getElementById('container');
let inputTask = document.querySelector('#enterTask');
let span = document.getElementById('span');
let todoContainer = document.getElementById('todo-container');
let progressContainer = document.getElementById('progress-container');
let doneContainer = document.getElementById('done-container');

let tasks = [];
let editingId = null;
let savedTasks = JSON.parse(localStorage.getItem('tasks'));
if(savedTasks) {
    tasks = savedTasks;
}
renderTasks();

function renderTasks() {
    todoContainer.innerHTML = '<h3>Todo ✍🏻<h3>';
    progressContainer.innerHTML = '<h3>In Progress ⏳<h3>';
    doneContainer.innerHTML = '<h3>Done 🎯<h3>';
    tasks.forEach((task) =>  {
        let paragragh = document.createElement('p');

        if(task.id === editingId) {
            let input = document.createElement('input');
            input.value = task.text;
            input.classList.add('edit-input')
            let cancelBtn = document.createElement('button');
            cancelBtn.textContent = '❌';
            cancelBtn.classList.add('cancel-btn');
            cancelBtn.dataset.id = task.id;
            let saveBtn = document.createElement('button');
            saveBtn.textContent = '✅';
            saveBtn.classList.add('save-btn');
            saveBtn.dataset.id = task.id;
            paragragh.append(input, saveBtn, cancelBtn);
        } else {
            let span = document.createElement('span');
            span.textContent = task.text;

            let deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('delete-btn');
        deleteButton.dataset.id = task.id;

        let editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.classList.add('edit-btn');
        editButton.dataset.id = task.id;

        paragragh.append(span, deleteButton, editButton);
        };

        if(task.status === 'todo') {
            let startBtn = document.createElement('button');
            startBtn.textContent = '➡️';
            startBtn.classList.add('start-btn');
            startBtn.dataset.id = task.id;
            paragragh.append(startBtn);
            todoContainer.append(paragragh);
        } else 
        if(task.status === 'in-progress') {
            let completeBtn = document.createElement('button');
            completeBtn.textContent = '➡️';
            completeBtn.classList.add('complete-btn');
            completeBtn.dataset.id = task.id;
            paragragh.append(completeBtn);

            let undoBtn = document.createElement('button');
            undoBtn.textContent = '↩️';
            undoBtn.classList.add('undo-btn');
            undoBtn.dataset.id = task.id;
            paragragh.append(undoBtn);
            progressContainer.append(paragragh);
        } else
        if(task.status === 'done') {
            let undoBtn = document.createElement('button');
            undoBtn.textContent = '↩️';
            undoBtn.classList.add('undo-btn');
            undoBtn.dataset.id = task.id;
            paragragh.append(undoBtn);
            doneContainer.append(paragragh);
        }
    });
};

addTask.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputValue = inputTask.value.trim();

    if(!inputValue) {
         span.textContent = 'Enter the task';
         return;
    } else {
        inputTask.value = '';
        span.textContent = '';
    }
    tasks.push({
        id: Date.now(),
        text: inputValue,
        status: 'todo'
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

inputTask.addEventListener('input', () => {
    if(inputTask.value.trim() !== '') {
     span.textContent = '';
    };
});

todoContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('save-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        let editEl = e.target.parentElement.querySelector('input');
        let edit = editEl.value.trim();

        if(edit !== '') {
            tasks[index].text = edit;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            editingId = null;
            renderTasks();
        };
    };

    if(e.target.classList.contains('cancel-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    }

    if(e.target.classList.contains('delete-btn')) {
    let id = Number(e.target.dataset.id);
    let index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    };

    if(e.target.classList.contains('edit-btn')) {
        editingId = Number(e.target.dataset.id);
       renderTasks();
    };

    if(e.target.classList.contains('start-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'in-progress';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };
});

progressContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('save-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        let editEl = e.target.parentElement.querySelector('input');
        let edit = editEl.value.trim();

        if(edit !== '') {
            tasks[index].text = edit;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            editingId = null;
            renderTasks();
        };
    };

    if(e.target.classList.contains('cancel-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    }

    if(e.target.classList.contains('delete-btn')) {
    let id = Number(e.target.dataset.id);
    let index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    };

    if(e.target.classList.contains('edit-btn')) {
       editingId = Number(e.target.dataset.id);
       renderTasks();
    };

    if(e.target.classList.contains('complete-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'done';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    if(e.target.classList.contains('undo-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'todo';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});

doneContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('save-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        let editEl = e.target.parentElement.querySelector('input');
        let edit = editEl.value.trim();

        if(edit !== '') {
            tasks[index].text = edit;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            editingId = null;
            renderTasks();
        };
    };

    if(e.target.classList.contains('cancel-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    }

    if(e.target.classList.contains('delete-btn')) {
    let id = Number(e.target.dataset.id);
    let index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    };

    if(e.target.classList.contains('edit-btn')) {
       editingId = Number(e.target.dataset.id);
       renderTasks();
    };

    if(e.target.classList.contains('undo-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'in-progress';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});