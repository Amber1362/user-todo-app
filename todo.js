let addTask = document.getElementById('todo');
let inputTask = document.querySelector('#enterTask');
let span = document.getElementById('span');
let todoContainer = document.getElementById('todo-container');
let progressContainer = document.getElementById('in-progress-container');
let doneContainer = document.getElementById('done-container');
let clearAlltasks = document.getElementById('clearAll');
clearAlltasks.classList.add('clear-all');
let priority = document.getElementById('priority');
let date = document.getElementById('enterDate');
let searchTask = document.getElementById('searchTask');
let filterButton = document.getElementById('filterButton');
let filterPanel = document.getElementById('filterPanel');
filterPanel.classList.add('hidden');
let closeFilterSpan = document.getElementById('closeFilterSpan');
let statusFilter = document.getElementById('statusFilter');
let priorityFilter = document.getElementById('priorityFilter');

//Supabase URL and KEY
let supabaseUrl = 'https://xjuiodjohmyjivbnrclv.supabase.co';
let supabaseKey = 'sb_publishable_OU4dAJXrbLoVFMoGWJBKZg_ULVqKZFi';

//FrontEnd to BackEnd connector
let supaBase = window.supabase.createClient(supabaseUrl, supabaseKey);

//State
let tasks = [] 
let editingId = null;

//Insert: Text, Status, Priority, Date
async function supabaseConnection(inputValue, inputPriority, inputDate, newPosition) {
    let {data, error} = await supaBase
    .from('tasks')
    .insert([
        {
        text: inputValue,
        status: 'todo',
        priority: inputPriority,
        date: inputDate || null,
        position: newPosition
        }
    ])
    .select();

    if(error) {
        console.log('Insert Error: ', error);
    } else {
        console.log('Inserted ', data);
    };
    console.log("INSERT CALLED")
};

//Fetching Data
async function getData() {
    try{
        let response = await fetch('https://xjuiodjohmyjivbnrclv.supabase.co/rest/v1/tasks', {
            method: 'GET',
            headers: {
                apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdWlvZGpvaG15aml2Ym5yY2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTQ1NDQsImV4cCI6MjA4NzY5MDU0NH0.9u_vEpG-pXsxZb1gsAX7kKDloNlERg22NNOs-2cND50',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdWlvZGpvaG15aml2Ym5yY2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTQ1NDQsImV4cCI6MjA4NzY5MDU0NH0.9u_vEpG-pXsxZb1gsAX7kKDloNlERg22NNOs-2cND50'
            }
        });

        if(!response.ok) {
            throw new Error('HTTP Error');
        }

        let dataStorage = await response.json();
        tasks = dataStorage;
        renderTasks(tasks);
    } catch(error) {
        console.error(error);
    }
}

//Delete Task async Function
async function deleteTasks(id) {
    await supaBase
    .from('tasks')
    .delete()
    .eq('id', id)
    await getData();
};

//Edit Task async Function
async function editTasks(newTask, id) {
    await supaBase
    .from('tasks')
    .update({text: newTask})
    .eq('id', id)
    await getData();
};

//Edit Priorities async Function
async function editPriorities(newPriorities, id) {
    await supaBase
    .from('tasks')
    .update({priority: newPriorities})
    .eq('id', id)
    await getData();
};

//Edit Status async Function
async function editStatus(newStatus, newPosition, id) {
    await supaBase
    .from('tasks')
    .update({status: newStatus,  position: newPosition})
    .eq('id', id)
    await getData();
};

async function deleteTodoTasks() {
    await supaBase
    .from('tasks')
    .delete()
    .eq('status', 'todo') 
    await getData();
}

async function deleteInProgressTasks() {
    await supaBase
    .from('tasks')
    .delete()
    .eq('status', 'in-progress')
    await getData(); 
}

async function deleteDoneTasks() {
    await supaBase
    .from('tasks')
    .delete()
    .eq('status', 'done')
    await getData();
}

async function deleteAllTasks() {

    await Promise.all([
     deleteTodoTasks(),
     deleteInProgressTasks(),
     deleteDoneTasks()
    ]);
    await getData();
}

async function updateTaskPosition(newPosition, id) {
    let {data, error} =  await supaBase
    .from('tasks')
    .update({position: newPosition})
    .eq('id', id)
}

//Search Task and Filteration
function searchfilteredTask() {
    let results = tasks;
    let searchQuery = searchTask.value.toLowerCase().trim();
    let selectFilterStatus = statusFilter.value.toLowerCase().trim();
    let selectFilterPriority = priorityFilter.value.toLowerCase();

    //Search bar 
    if(searchQuery !== '') {
     results = results.filter(task => task.text.toLowerCase().includes(searchQuery));
    };

    //Status Filter
    if(selectFilterStatus !== 'all') {
    results = results.filter(task => task.status.toLowerCase().includes(selectFilterStatus));
    };
     
    //Priority Filter 
    if(selectFilterPriority !== 'all') {
    results = results.filter(task => task.priority.toLowerCase().includes(selectFilterPriority));
    };

    renderTasks(results);
};

//Search Task Event handler
searchTask.addEventListener('input', searchfilteredTask);
//Status Filter Event handler
statusFilter.addEventListener('change', searchfilteredTask);
//Priority Filter Event handler
priorityFilter.addEventListener('change', searchfilteredTask);

//Display Filter Button 
filterButton.addEventListener('click', () => {
        filterPanel.style.display = 'grid';
        overlay.style.display = 'block';
});

//Close Filter Button
closeFilterSpan.addEventListener('click', () => {
    filterPanel.style.display = 'none';
    overlay.style.display = 'none';
});

//Render UI
function renderTasks(array = tasks) {
    //Containers Header
    todoContainer.innerHTML = '<h3>Todo ✍🏻</h3>';
    progressContainer.innerHTML = '<h3>In Progress ⏳</h3>';
    doneContainer.innerHTML = '<h3>Done 🎯</h3>';

    array.forEach((task) =>  {
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

            //Edit Priority: select
            let editPriority = document.createElement('select');
            editPriority.classList.add('edit-priority');
            editPriority.value = task.priority;

            //Edit Priority: High(option 1)
            let optionOne = document.createElement('option');
            optionOne.textContent = 'Priority: ' + 'High';
            optionOne.value = 'High';

            //Edit Priority: Medium(option 2)
            let optionTwo = document.createElement('option');
            optionTwo.textContent = 'Priority: ' + 'Medium';
            optionTwo.value = 'Medium';

            //Edit Priority: Low(option 3)
            let optionThree = document.createElement('option');
            optionThree.textContent = 'Priority: ' + 'Low';
            optionThree.value = 'Low';

            //Add Priority options to the SELECT
            editPriority.append(optionOne, optionTwo, optionThree);
            console.log(tasks);

            //Edit Button: Cancel Edit Button
            let cancelBtn = document.createElement('button');
            cancelBtn.textContent = '\u00D7';
            cancelBtn.classList.add('cancel-btn');
            cancelBtn.dataset.id = task.id;

            //Edit Button: Save Edit Button
            let saveBtn = document.createElement('button');
            saveBtn.textContent = '✔';
            saveBtn.classList.add('save-btn');
            saveBtn.dataset.id = task.id;

            divContainer.append(input, editPriority);
            paragragh.append(divContainer, saveBtn, cancelBtn);//Append in the Paragragh;
        } else {
            //Task text
            let span = document.createElement('span');
            span.textContent = task.text;
            span.classList.add('span-text');
            span.dataset.id = task.id;

            //Delete Task Button
            let deleteButton = document.createElement('button');
        deleteButton.textContent = '\u00D7';
        deleteButton.classList.add('delete-btn');
        deleteButton.dataset.id = task.id;

        //Edit Task Button
        let editButton = document.createElement('button');
        editButton.textContent = '✎';
        editButton.classList.add('edit-btn');
        editButton.dataset.id = task.id;

        divContainer.append(span);
        paragragh.append(divContainer, deleteButton, editButton);//Append in the Paragragh
        };

        if(task.status === 'todo') {  //Todo Container
            //Start Button
            let startBtn = document.createElement('button');
            startBtn.textContent = '➜';
            startBtn.classList.add('start-btn');
            startBtn.dataset.id = task.id;
            paragragh.append(startBtn);
            todoContainer.append(paragragh);
        } else 
        if(task.status === 'in-progress') {  //In-Progress Container
            //Complete Button
            let completeBtn = document.createElement('button');
            completeBtn.textContent = '➜';
            completeBtn.classList.add('complete-btn');
            completeBtn.dataset.id = task.id;
            paragragh.append(completeBtn);

            //Undo Button
            let undoBtn = document.createElement('button');
            undoBtn.textContent = '↩';
            undoBtn.classList.add('undo-btn');
            undoBtn.dataset.id = task.id;
            paragragh.append(undoBtn);
            progressContainer.append(paragragh);
        } else
        if(task.status === 'done') {   //Done Container
            //Undo Button
            let undoBtn = document.createElement('button');
            undoBtn.textContent = '↩';
            undoBtn.classList.add('undo-btn');
            undoBtn.dataset.id = task.id;
            paragragh.append(undoBtn);
            doneContainer.append(paragragh);
        };

        //Task Priority Span text 
        let badge = document.createElement('span');
        badge.textContent = 'Priority: ' + task.priority;
        badge.classList.add('span-priority');
        badge.dataset.id = task.id;
        divContainer.append(badge);

        //Task Priority Border left Colors
        if(task.priority === 'High') {
            paragragh.style.borderLeft = '8px solid rgb(170, 0, 0)';
        } else if(task.priority === 'Medium') {
            paragragh.style.borderLeft = '8px solid rgb(143, 176, 216)';
        } else if(task.priority === 'Low') {
            paragragh.style.borderLeft = '8px solid rgb(0, 150, 0)';
        };

        let childDivContainer = document.createElement('div');
        childDivContainer.classList.add('child-div-container');

        //Due Date Span Text
        let dateSpan = document.createElement('span');
        dateSpan.textContent = '[ Due: ' + task.date + ' ]';
        dateSpan.dataset.id = task.id;
        dateSpan.classList.add('date-span');
        childDivContainer.append(dateSpan);
        divContainer.append(childDivContainer);

        if(!task.date) {
            dateSpan.textContent = '';
        };

        //Today's date 
        let todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        //Due Date
        let dueDate = new Date(task.date);
        dueDate.setHours(0, 0, 0, 0);

        //Difference between today's date and due date 
        let differenceInDays = (dueDate - todayDate) / 86400000;
        let dueDateAlert = document.createElement('span');
        dueDateAlert.dataset.id = task.id;
        dueDateAlert.classList.add('due-date-alert');
        childDivContainer.append(dueDateAlert);
        dueDateAlert.style.padding = '8px';

        //Set Due Date Alert
        if(differenceInDays === 0) {
            //Due Today
            dueDateAlert.textContent = 'Due today';
            dueDateAlert.style.color = 'rgb(220, 80, 0)';
        } else if(differenceInDays === 1) {
            //Due In 1 day
            dueDateAlert.textContent = 'Due in 1 day';
            dueDateAlert.style.color = 'rgb(80, 80, 80)';
        } else if(differenceInDays === 2) {
            //Due in 2 days
            dueDateAlert.style.color = 'rgb(80, 80, 80)';
            dueDateAlert.textContent = 'Due in 2 days';
        } else if(differenceInDays < 0) {
            //Overdue
            dueDateAlert.textContent = 'Overdue';
            dueDateAlert.style.color = 'rgb(255, 0, 0)';
            dueDateAlert.style.fontWeight = 'bold';
        }

        //Showcase 'Task completed' if it's in Done Container
        if(task.status === 'done') {
            dueDateAlert.textContent = 'Task completed ✔';
            dueDateAlert.style.color = 'rgb(80, 80, 80)';
            dueDateAlert.style.fontWeight = 'normal'
        } else if(task.date === null) {
            //Showcase empty if the date is not selected
            dueDateAlert.textContent = '';
        };
        // tasks.sort((a, b) => a.position - b.position)
    });
};

//{Enter Task Input} 
addTask.addEventListener('submit', async (e) => {
    e.preventDefault();
    let inputValue = inputTask.value.trim();
    let inputPriority = priority.value;
    let inputDate = date.value;

    if(!inputValue) {
         span.textContent = 'Enter the task!';
         return;
    } else {
        inputTask.value = '';
        addTask.reset();
    };


     let todoColumnPosition = tasks.filter(t => t.status === 'todo')
    
     let maxPosition = Math.max(...todoColumnPosition.map(t => t.position), 0);

     let newPosition = maxPosition + 1;

      await supabaseConnection(inputValue, inputPriority, inputDate, newPosition);
     
      await getData();

    // let progressColumnPosition = tasks.filter(task => task.status === 'in-progress')
    // .sort((x, y) => x.position - y.position)
    
    // progressColumnPosition.forEach((task, index) => {
    //     task.position = (index + 1)
    // })

    // for(let task of progressColumnPosition) {
    //     await updateTaskPosition(task.position, task.id)
    // }

});

//Removes Alert span text once start typing in the Input
inputTask.addEventListener('input', () => {
    if(inputTask.value.trim() !== '') {
     span.textContent = '';
    };
});

//Clear All Tasks Button
clearAlltasks.addEventListener('click', async () => {
   if(tasks.length > 0) {
   if(confirm('Are you sure you want clear all the tasks?')) {
   await deleteAllTasks();
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
todoContainer.addEventListener('drop', async (e) => {
    e.preventDefault();
  let column = e.target.closest('#todo-container, #in-progress-container, #done-container');
  let id = e.dataTransfer.getData('text/plain');//Correct

  let draggedTask = tasks.find(t => t.id === id);
  let sourceStatus = draggedTask.status;

  console.log(draggedTask);

  let targetStatus = column.id.replace('-container', '');
  if(targetStatus === null) {
    return;
  }

  let todoColumnPosition = tasks.filter(t => t.status === targetStatus);

  let maxPosition = Math.max(...todoColumnPosition.map(t => t.position), 0);

  let newPosition = maxPosition + 1;

  let newStatus = targetStatus;

  await editStatus(newStatus, newPosition, id);

  let draggedTaskPosition = tasks.filter(t => t.status === sourceStatus)
  .sort((a, b) => a.position - b.position)

  draggedTaskPosition.forEach((t, index) => {
    t.position = index + 1;
  })

  for(let t of draggedTaskPosition) {
    await updateTaskPosition(t.position, t.id);
  }

  await getData();
//   let targetStatus = column.id.replace('-container', '');
   
//   if(sourceStatus === targetStatus) {//Drops task in the same Container
//     tasks.splice(index, 1); //Deletes the Dragged task from it position through it's index;

    //Drops the task in the empty space
    // if(targetIndex === -1) {
    //     tasks.push(draggedItem);
    // } else {
        //Drops the task at the targeted task
//     let isMovingDown = index < targetIndex;
//     let insertIndex = isMovingDown ? targetIndex : targetIndex;
//     tasks.splice(insertIndex, 0, draggedItem);
//     };
// } else {
    //Drops the task across the Container
//     tasks.splice(index, 1);
//     draggedItem.status = targetStatus;
//     let isMovingDown = index < targetIndex;
//     let insertIndex = isMovingDown ? targetIndex - 1 : targetIndex;
//     tasks.splice(insertIndex, 0, draggedItem);
//     // tasks.push(draggedItem);
//   };
// //   await supabaseConnection();
// console.log("DROP TRIGGERED");
//   await getData(newStatus);
//    localStorage.setItem('tasks', JSON.stringify(tasks));
    // renderTasks();
});



//Progress Container Drop
progressContainer.addEventListener('drop', async (e) => {
    e.preventDefault();
    let column = e.target.closest('#todo-container, #in-progress-container, #done-container');
  let id = e.dataTransfer.getData('text/plain');

  let draggedTask = tasks.find(t => t.id === id);
  let sourceStatus = draggedTask.status;

  console.log(draggedTask.status);

  let targetStatus = column.id.replace('-container', '');
  if(targetStatus === null) {
    return;
  }

  let progressColumnPosition = tasks.filter(t => t.status === targetStatus);
  
  let maxPosition = Math.max(...progressColumnPosition.map(t => t.position), 0);

  let newPosition = maxPosition + 1;

   let newStatus = targetStatus;

  await editStatus(newStatus, newPosition, id);

  let draggedTaskPosition = tasks.filter(t => t.status === sourceStatus)
  .sort((a, b) => a.position - b.position);

  draggedTaskPosition.forEach((t, index) => {
    t.position = index + 1;
  })

  for(let t of draggedTaskPosition) {
    await updateTaskPosition(t.position, t.id);
  }

  await getData();

//   let targetTaskEl = e.target.closest('p');
//   let targetIndex = targetTaskEl ? tasks.findIndex(t => t.id === targetTaskEl.dataset.id) : -1; //targetIndex

//   console.log("DOM ID:", id);
// console.log("Tasks:", tasks);
   
//   let index = tasks.findIndex(t => t.id === id);//dragIndex;
//   let draggedItem = tasks[index];
//   console.log('index', index);

//   let sourceStatus = draggedItem.status;
//   let targetStatus = column.id.replace('-container', '');

//   if(sourceStatus === targetStatus) {//Drops task in the same Container
//      tasks.splice(index, 1); //Deletes the Dragged task from it position through it's index;

//      //Drops the task in the empty space
//      if(targetIndex === -1) {
//         tasks.push(draggedItem);
//      } else {
//         //Drops the task at the targeted task
//         let isMovingDown = index < targetIndex;
//         let insertIndex = isMovingDown ? targetIndex : targetIndex;
//         tasks.splice(insertIndex, 0, draggedItem);
//      };
//   } else {
//      //Drops the task across the Container
//      tasks.splice(index, 1);
//      draggedItem.status = targetStatus;
//      let isMovingDown = index < targetIndex;
//         let insertIndex = isMovingDown ? targetIndex - 1 : targetIndex;
//         tasks.splice(insertIndex, 0, draggedItem);
//         console.log(insertIndex);
//     //  tasks.push(draggedItem);
//   };
// //   await supabaseConnection();
// console.log("DROP TRIGGERED");
//   await getData(newStatus);
//    localStorage.setItem('tasks', JSON.stringify(tasks));
    // renderTasks();
});

//Done Container Drop
doneContainer.addEventListener('drop', async (e) => {
    e.preventDefault();
    let column = e.target.closest('#todo-container, #in-progress-container, #done-container');
  let id = e.dataTransfer.getData('text/plain');

  let draggedTask = tasks.find(t => t.id === id); 
  let sourceStatus = draggedTask.status;
  console.log(sourceStatus);

  let targetStatus = column.id.replace('-container', '');
  if(targetStatus === null) {
    return;
  }

  let doneColumnPosition = tasks.filter(t => t.status === targetStatus);

  let maxPosition = Math.max(...doneColumnPosition.map(t => t.position), 0);

  let newPosition = maxPosition + 1;

  let newStatus = targetStatus;

  await editStatus(newStatus, newPosition, id);

  let draggedTaskPosition = tasks.filter(t => t.status === sourceStatus)
  .sort((a, b) => a.position - b.position);

  draggedTaskPosition.forEach((t, index) => {
    t.position = index + 1;
  })

  for(let t of draggedTaskPosition) {
    await updateTaskPosition(t.position, t.id);
  }

  await getData();
//   let targetTaskEl = e.target.closest('p');
//    let targetIndex = targetTaskEl ? tasks.findIndex(t => t.id === targetTaskEl.dataset.id) : -1; //targetIndex

//   let index = tasks.findIndex(t => t.id === id);//dragIndex
//   let draggedItem = tasks[index];

//   let sourceStatus = draggedItem.status;
//   let targetStatus = column.id.replace('-container', '');

//   if(sourceStatus === targetStatus) { //Drops task in the same Container
//     tasks.splice(index, 1); //Deletes the Dragged task from it position through it's index;

//      //Drops the task in the empty space
//     if(targetIndex === -1) {
//         tasks.push(draggedItem);
//     } else {
//          //Drops the task at the targeted task
//         let isMovingDown = index < targetIndex;
//         let insertIndex = isMovingDown ? targetIndex : targetIndex;
//         tasks.splice(insertIndex, 0, draggedItem);
//     };
//   } else {
//     //Drops the task across the Container
//     tasks.splice(index, 1);
//     draggedItem.status = targetStatus;
//     let isMovingDown = index < targetIndex;
//         let insertIndex = isMovingDown ? targetIndex - 1 : targetIndex;
//         tasks.splice(insertIndex, 0, draggedItem);
//         // console.log(targetIndex);
//     // tasks.push(draggedItem);
//   };
//   await supabaseConnection();
//   getData();
    // localStorage.setItem('tasks', JSON.stringify(tasks));
    // renderTasks();
});

//Todo Container Click Listener
todoContainer.addEventListener('click', async (e) => {
    //Save Button
    if(e.target.classList.contains('save-btn')) {
        let id = e.target.dataset.id;
        // let index = tasks.findIndex(t => t.id === id);
        let editEl = e.target.parentElement.querySelector('input');
        let edit = editEl.value.trim();

        let editTaskPrioirity = e.target.parentElement.querySelector('select');
        let editTask = editTaskPrioirity.value;

        if(edit !== '') {
            newTask = edit;
            await editTasks(newTask, id);
            editingId = null;

        if(editTask) {
            newPriorities = editTask;
            await editPriorities(newPriorities, id);
            editingId = null;
        }
        };
    };

    //Cancel Button
    if(e.target.classList.contains('cancel-btn')) {
        let id = e.target.dataset.id;
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks()
    };

    //Delete Button
    if(e.target.classList.contains('delete-btn')) {
        let taskId = e.target.dataset.id;
        if(confirm('Delete the task?')) {
             await deleteTasks(taskId);

            let todoColumnPosition = tasks.filter(t => t.status === 'todo')
            .sort((a, b) => a.position - b.position);

            todoColumnPosition.forEach((t, index) => {
                t.position = index + 1;
            })

            for(let t of todoColumnPosition) {
                await updateTaskPosition(t.position, t.id);
            }

            await getData();
        }
     console.log(taskId);
    };

    //Edit Button
    if(e.target.classList.contains('edit-btn')) {
        editingId = e.target.dataset.id;
       renderTasks();
    };

    //Start Button
    if(e.target.classList.contains('start-btn')) {
        let id = e.target.dataset.id;

        newStatus = 'in-progress';//Change task into in-progress Container

        let progressColumnPosition = tasks.filter(t => t.status === 'in-progress')

        let maxPosition = Math.max(...progressColumnPosition.map(t => t.position), 0);

        let newPosition = maxPosition + 1;

        await editStatus(newStatus, newPosition, id);

        let todoColumnPosition = tasks.filter(t => t.status === 'todo')
            .sort((a, b) => a.position - b.position);

            todoColumnPosition.forEach((t, index) => {
                t.position = index + 1;
            })

            for(let t of todoColumnPosition) {
                await updateTaskPosition(t.position, t.id);
            }

            await getData();
    };
});

//Progress Container click Listener
progressContainer.addEventListener('click', async (e) => {
    //Save Button
    if(e.target.classList.contains('save-btn')) {
        let id = e.target.dataset.id;

        let editEl = e.target.parentElement.querySelector('input');
        let edit = editEl.value.trim();

        let editTaskPriority = e.target.parentElement.querySelector('select');
        let editTask = editTaskPriority.value;

        if(edit !== '') {
            newTask = edit;
            await editTasks(newTask, id);
            editingId = null;
        };

        if(editTask) {
            newPriorities = editTask;
             editingId = null;
            await editPriorities(newPriorities, id);
        };
    };

    //Cancel Button
    if(e.target.classList.contains('cancel-btn')) {
        let id = e.target.dataset.id;
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    };

    //Delete Button
    if(e.target.classList.contains('delete-btn')) {
    let taskId = e.target.dataset.id;
    if(confirm('Delete the task?')) {
        await deleteTasks(taskId);

        let progressColumnPosition = tasks.filter(t => t.status === 'in-progress')
        .sort((a, b) => a.position - b.position)

        progressColumnPosition.forEach((t, index) => {
            t.position = index + 1;
        })

        for(let t of progressColumnPosition) {
            await updateTaskPosition(t.position, t.id);
        }

        await getData();
    }
    };

    //Edit Button
    if(e.target.classList.contains('edit-btn')) {
       editingId = e.target.dataset.id;
       renderTasks();
    };

    //Complete Button
    if(e.target.classList.contains('complete-btn')) {
        let id = e.target.dataset.id;
        newStatus = 'done';// Change task into Done Container

        let doneColumnPosition = tasks.filter(t => t.status === 'done');

        let maxPosition = Math.max(...doneColumnPosition.map(t => t.position), 0);

        let newPosition = maxPosition + 1;

        await editStatus(newStatus, newPosition, id);

        let progressColumnNormalization = tasks.filter(t => t.status === 'in-progress')
        .sort((a, b) => a.position - b.position)

        progressColumnNormalization.forEach((t, index) => {
            t.position = index + 1;
        })

        for(let t of progressColumnNormalization) {
            await updateTaskPosition(t.position, t.id);
        }

        await getData();
    };

    //Undo Button
    if(e.target.classList.contains('undo-btn')) {
        let id = e.target.dataset.id;
        newStatus = 'todo';// Change task into Todo Container

        let todoColumnPosition = tasks.filter(t => t.status === 'todo');

        let maxPosition = Math.max(...todoColumnPosition.map(t => t.position), 0);

        let newPosition = maxPosition + 1;
        await editStatus(newStatus, newPosition, id);

         let progressColumnNormalization = tasks.filter(t => t.status === 'in-progress')
        .sort((a, b) => a.position - b.position)

        progressColumnNormalization.forEach((t, index) => {
            t.position = index + 1;
        })

        for(let t of progressColumnNormalization) {
            await updateTaskPosition(t.position, t.id);
        }

        await getData();
    };
});

//Done Container Click Listener
doneContainer.addEventListener('click', async (e) => {
    //Save Button
    if(e.target.classList.contains('save-btn')) {
        let id = e.target.dataset.id;
        
        let editEl = e.target.parentElement.querySelector('input');
        let edit = editEl.value.trim();

        let editTaskPriority = e.target.parentElement.querySelector('select');
        let editTask = editTaskPriority.value;

        if(edit !== '') {
           newTask = edit;
            await editTasks(newTask, id);
            editingId = null;
        }

            if(editTask) {
                newPriorities = editTask;
                editingId = null;
                await editPriorities(newPriorities, id);
            };
    };

    //Cancel Button
    if(e.target.classList.contains('cancel-btn')) {
        let id = e.target.dataset.id;
        let index = tasks.findIndex(t => t.id === id);
        editingId = null;
        renderTasks();
    };

    //Delete Button
    if(e.target.classList.contains('delete-btn')) {
    let taskId = e.target.dataset.id;
    if(confirm('Delete the task?')) {
        await deleteTasks(taskId);
    }

    let doneColumnPosition = tasks.filter(t => t.status === 'done')
    .sort((a, b) => a.position - b.position)

    doneColumnPosition.forEach((t, index) => {
        t.position = index + 1;
    })

    for(let t of doneColumnPosition) {
        await updateTaskPosition(t.position, t.id);
    }

    await getData();
    };

    //Edit Button
    if(e.target.classList.contains('edit-btn')) {
       editingId = e.target.dataset.id;
       renderTasks();
    };

    //Undo Button
    if(e.target.classList.contains('undo-btn')) {
        let id = e.target.dataset.id;
        newStatus = 'in-progress'; //Undo Task into in-progress Container

        let progressColumnPosition = tasks.filter(t => t.status === 'in-progress');

        let maxPosition = Math.max(...progressColumnPosition.map(t => t.position), 0);

        let newPosition = maxPosition + 1
        await editStatus(newStatus, newPosition, id);

        let doneColumnNormalization = tasks.filter(t => t.status === 'done')
        .sort((a, b) => a.position - b.position)

        doneColumnNormalization.forEach((t, index) => {
            t.position = index + 1;
        })

        for(let t of doneColumnNormalization) {
            await updateTaskPosition(t.position, t.id);
        }

        await getData();
    };
});

 getData();