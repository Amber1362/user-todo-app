let addTask = document.getElementById('todo');
let inputTask = document.querySelector('#enterTask');
let span = document.getElementById('span');
let todoContainer = document.getElementById('todo-container');
let progressContainer = document.getElementById('in-progress-container');
let doneContainer = document.getElementById('done-container');
let clearAlltasks = document.getElementById('clearAll');
clearAlltasks.classList.add('clear-all');
let priority = document.getElementById('priority');

let tasks = []; //State
let editingId = null;
let savedTasks = JSON.parse(localStorage.getItem('tasks')); //Local Storage
if(savedTasks) {
    tasks = savedTasks;
}
renderTasks();

//Render UI
function renderTasks() {
    todoContainer.innerHTML = '<h3>Todo ✍🏻<h3>';
    progressContainer.innerHTML = '<h3>In Progress ⏳<h3>';
    doneContainer.innerHTML = '<h3>Done 🎯<h3>';

    tasks.forEach((task) =>  {
        let paragragh = document.createElement('p');
        let divContainer = document.createElement('div');
        divContainer.classList.add('div-container');
        paragragh.draggable = true;
        paragragh.dataset.id = task.id;

        if(task.id === editingId) {
            //Edit Button: Input part
            let input = document.createElement('input');
            input.focus();
            input.value = task.text;
            input.classList.add('edit-input');

            //Edit Button: Cancel Edit Button
            let cancelBtn = document.createElement('button');
            cancelBtn.textContent = '❌';
            cancelBtn.classList.add('cancel-btn');
            cancelBtn.dataset.id = task.id;

            //Edit Button: Save Edit Button
            let saveBtn = document.createElement('button');
            saveBtn.textContent = '✅';
            saveBtn.classList.add('save-btn');
            saveBtn.dataset.id = task.id;

            divContainer.append(input);
            paragragh.append(divContainer, saveBtn, cancelBtn);//Append in the Paragragh;
        } else {
            //Task text
            let span = document.createElement('span');
            span.textContent = task.text;
            span.classList.add('span-text');
            span.dataset.id = task.id;

            //Delete Task Button
            let deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('delete-btn');
        deleteButton.dataset.id = task.id;

        //Edit Task Button
        let editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.classList.add('edit-btn');
        editButton.dataset.id = task.id;

        divContainer.append(span);
        paragragh.append(divContainer, deleteButton, editButton);//Append in the Paragragh
        };

        if(task.status === 'todo') {  //Todo Container
            //Start Button
            let startBtn = document.createElement('button');
            startBtn.textContent = '➡️';
            startBtn.classList.add('start-btn');
            startBtn.dataset.id = task.id;
            paragragh.append(startBtn);
            todoContainer.append(paragragh);
        } else 
        if(task.status === 'in-progress') {  //In-Progress Container
            //Complete Button
            let completeBtn = document.createElement('button');
            completeBtn.textContent = '➡️';
            completeBtn.classList.add('complete-btn');
            completeBtn.dataset.id = task.id;
            paragragh.append(completeBtn);

            //Undo Button
            let undoBtn = document.createElement('button');
            undoBtn.textContent = '↩️';
            undoBtn.classList.add('undo-btn');
            undoBtn.dataset.id = task.id;
            paragragh.append(undoBtn);
            progressContainer.append(paragragh);
        } else
        if(task.status === 'done') {   //Done Container
            //Undo Button
            let undoBtn = document.createElement('button');
            undoBtn.textContent = '↩️';
            undoBtn.classList.add('undo-btn');
            undoBtn.dataset.id = task.id;
            paragragh.append(undoBtn);
            doneContainer.append(paragragh);
        };
        let badge = document.createElement('span');
        badge.textContent = 'Priority: ' + task.priority;
        badge.classList.add('span-priority');
        badge.dataset.id = task.id;
        divContainer.append(badge);

        if(task.priority === 'High') {
            paragragh.style.borderLeft = '8px solid rgb(255, 0, 0)';
        } else if(task.priority === 'Medium') {
            paragragh.style.borderLeft = '8px solid rgb(255, 140, 0)';
        } else if(task.priority === 'Low') {
            paragragh.style.borderLeft = '8px solid rgb(0, 150, 0)'
        }
    });
};

//Enter Task Input 
addTask.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputValue = inputTask.value.trim();
    let inputPriority = priority.value;

    if(!inputValue) {
         span.textContent = 'Enter the task!';
         return;
    } else {
        inputTask.value = '';
    }

    tasks.push({
        id: Date.now(),
        text: inputValue,
        status: 'todo',
        priority: inputPriority,
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

//Removes Alert span text once start typing in the Input
inputTask.addEventListener('input', () => {
    if(inputTask.value.trim() !== '') {
     span.textContent = '';
    };
});

//Clear All Tasks Button
clearAlltasks.addEventListener('click', () => {
   if(tasks.length > 0) {
   if(confirm('Are you sure you want clear all the tasks?')) {
    tasks = [];
   localStorage.setItem('tasks', JSON.stringify(tasks));
   renderTasks();
   };
  };
});

//Todo Container Drag Start
todoContainer.addEventListener('dragstart', (e) => {
    let taskEl = e.target.closest('p');//Selects Paragragh by its Tag(p)
    if(taskEl) {
        e.dataTransfer.setData('text/plain', taskEl.dataset.id); //Paragragh's id
    };
});

//Progress Container Drag Start
progressContainer.addEventListener('dragstart', (e) => {
    let taskEl = e.target.closest('p');//Selects Paragragh by it's Tag(p)
    if(taskEl) {
        e.dataTransfer.setData('text/plain', taskEl.dataset.id); //Paragragh's id
    };
});

//Done Container Drag Start
doneContainer.addEventListener('dragstart', (e) => {
    let taskEl = e.target.closest('p');//Selects Paragragh by it's Tag(p)
    if(taskEl) {
        e.dataTransfer.setData('text/plain', taskEl.dataset.id); //Paragragh's id
    };
});

//Dragover Listener
todoContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

progressContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

doneContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

//Todo Container drop
todoContainer.addEventListener('drop', (e) => {
    e.preventDefault();
  let column = e.target.closest('#todo-container, #in-progress-container, #done-container');
  let id = Number(e.dataTransfer.getData('text/plain'));

  let targetTaskEl = e.target.closest('p');
  let targetIndex = targetTaskEl ? tasks.findIndex(t => t.id === Number(targetTaskEl.dataset.id)) : -1;//targetIndex

  let index = tasks.findIndex(t => t.id === id);//dragIndex
  let draggedItem = tasks[index];

  let sourceStatus = draggedItem.status;
  let targetStatus = column.id.replace('-container', '');
   
  if(sourceStatus === targetStatus) {//Drops task in the same Container
    tasks.splice(index, 1); //Deletes the Dragged task from it position through it's index;

    //Drops the task in the empty space
    if(targetIndex === -1) {
        tasks.push(draggedItem);
    } else {
        //Drops the task at the targeted task
    let isMovingDown = index < targetIndex;
    let insertIndex = isMovingDown ? targetIndex : targetIndex;
    tasks.splice(insertIndex, 0, draggedItem);
    };
} else {
    //Drops the task across the Container
    tasks.splice(index, 1);
    draggedItem.status = targetStatus
    tasks.push(draggedItem);
  };
   localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

//Progress Container Drop
progressContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    let column = e.target.closest('#todo-container, #in-progress-container, #done-container');
  let id = Number(e.dataTransfer.getData('text/plain'));

  let targetTaskEl = e.target.closest('p');
   let targetIndex = targetTaskEl ? tasks.findIndex(t => t.id === Number(targetTaskEl.dataset.id)) : -1; //targetIndex
   
  let index = tasks.findIndex(t => t.id === id);//dragIndex;
  let draggedItem = tasks[index];

  let sourceStatus = draggedItem.status;
  let targetStatus = column.id.replace('-container', '');

  if(sourceStatus === targetStatus) {//Drops task in the same Container
     tasks.splice(index, 1); //Deletes the Dragged task from it position through it's index;

     //Drops the task in the empty space
     if(targetIndex === -1) {
        tasks.push(draggedItem);
     } else {
        //Drops the task at the targeted task
        let isMovingDown = index < targetIndex;
        let insertIndex = isMovingDown ? targetIndex : targetIndex;
        tasks.splice(insertIndex, 0, draggedItem);
     };
  } else {
     //Drops the task across the Container
     tasks.splice(index, 1);
     draggedItem.status = targetStatus;
     tasks.push(draggedItem);
  };
   localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

//Done Container Drop
doneContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    let column = e.target.closest('#todo-container, #in-progress-container, #done-container');
  let id = Number(e.dataTransfer.getData('text/plain'));

  let targetTaskEl = e.target.closest('p');
   let targetIndex = targetTaskEl ? tasks.findIndex(t => t.id === Number(targetTaskEl.dataset.id)) : -1; //targetIndex

  let index = tasks.findIndex(t => t.id === id);//dragIndex
  let draggedItem = tasks[index];

  let sourceStatus = draggedItem.status;
  let targetStatus = column.id.replace('-container', '');

  if(sourceStatus === targetStatus) { //Drops task in the same Container
    tasks.splice(index, 1); //Deletes the Dragged task from it position through it's index;

     //Drops the task in the empty space
    if(targetIndex === -1) {
        tasks.push(draggedItem);
    } else {
         //Drops the task at the targeted task
        let isMovingDown = index < targetIndex;
        let insertIndex = isMovingDown ? targetIndex : targetIndex;
        tasks.splice(insertIndex, 0, draggedItem);
    };
  } else {
    //Drops the task across the Container
    tasks.splice(index, 1);
    draggedItem.status = targetStatus;
    tasks.push(draggedItem);
  };
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

//Todo Container Click Listener
todoContainer.addEventListener('click', (e) => {
    //Save Button
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

    //Cancel Button
    if(e.target.classList.contains('cancel-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    };

    //Delete Button
    if(e.target.classList.contains('delete-btn')) {
    let id = Number(e.target.dataset.id);
    let index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1);//Delete the task
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    };

    //Edit Button
    if(e.target.classList.contains('edit-btn')) {
        editingId = Number(e.target.dataset.id);
       renderTasks();
    };

    //Start Button
    if(e.target.classList.contains('start-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'in-progress';//Change task into in-progress Container
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };
});

//Progress Container click Listener
progressContainer.addEventListener('click', (e) => {
    //Save Button
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

    //Cancel Button
    if(e.target.classList.contains('cancel-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    };

    //Delete Button
    if(e.target.classList.contains('delete-btn')) {
    let id = Number(e.target.dataset.id);
    let index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1); // Delete the Task
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    };

    //Edit Button
    if(e.target.classList.contains('edit-btn')) {
       editingId = Number(e.target.dataset.id);
       renderTasks();
    };

    //Complete Button
    if(e.target.classList.contains('complete-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'done';// Change task into Done Container
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    //Undo Button
    if(e.target.classList.contains('undo-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'todo';// Change task into Todo Container
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };
});

//Done Container Click Listener
doneContainer.addEventListener('click', (e) => {
    //Save Button
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

    //Cancel Button
    if(e.target.classList.contains('cancel-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    };

    //Delete Button
    if(e.target.classList.contains('delete-btn')) {
    let id = Number(e.target.dataset.id);
    let index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1); // Delete the Task
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    };

    //Edit Button
    if(e.target.classList.contains('edit-btn')) {
       editingId = Number(e.target.dataset.id);
       renderTasks();
    };

    //Undo Button
    if(e.target.classList.contains('undo-btn')) {
        let id = Number(e.target.dataset.id);
        let index = tasks.findIndex(t => t.id === id);
        tasks[index].status = 'in-progress'; //Undo Task into in-progress Container
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };
});