// creating a to do list app

class Task{
    constructor(id, value, completed){
        this.id = id;
        this.value = value;
        this.completed = completed;
    }
}

let new_task_element = document.getElementById("new-task");
let pending_tasks_list = document.getElementById("New-tasks-List");
let task_count = 0;
let add_btn = document.getElementById("add_new_task");
let task_list = [];



function addTask(task , task_list){
    task_list.push(task);        
}

function addingTaskToScreen(task){
    let new_task_area = document.createElement("li");
    new_task_area.setAttribute("id", `${task.id}`);
        

    // adding complete button for every child
    let complete = document.createElement("button");
    let img2 = document.createElement("img");
    img2.setAttribute("src", "./images/round.png");
    complete.appendChild(img2);
    complete.setAttribute("class","complete-btn");
    new_task_area.appendChild(complete);

    // Create a span for the task text
    let taskText = document.createElement("span");
    taskText.textContent = task.value;
    new_task_area.appendChild(taskText);

    // add a remove button for every task
    let removeBtn = document.createElement("button");
    let img1 = document.createElement("img");
    img1.setAttribute("src", "./images/crossed.png");
    removeBtn.appendChild(img1);
    removeBtn.setAttribute("class", "remove-btn");
    new_task_area.appendChild(removeBtn);

    pending_tasks_list.appendChild(new_task_area);
}

function removeTask(task_id, task_list){
    let i = task_list.findIndex(task => task.id === task_id);
    if (i !== -1) {
        task_list.splice(i, 1); // Used to removes deleteCount elements starting at position start
        task_count--;
        console.log(`Removing task ${task_id}`);
        console.log(`task count : ${task_count}`);
    }
}

function completeTask(task_id, task_list){
    let task = task_list.find(t => t.id === task_id);
    if (task) {
        task.completed = true;
        console.log(`Completed task: ${task.value}`);
    } else {
        console.error(`Task with ID ${task_id} not found.`);
    }
}


function save(){
    localStorage.setItem("data", pending_tasks_list.innerHTML);
}
function showTasks(){
    pending_tasks_list.innerHTML = localStorage.getItem("data");
}
showTasks();


add_btn.addEventListener("click", () => {
    let task = new_task_element.value.trim();
    if (task !== "") {
        // adding it to the pending task element 
        console.log(`adding the task: ${task}`);
        
        let new_task = new Task(`task-${++task_count}`, task , false);
        addTask(new_task, task_list);
        addingTaskToScreen(new_task);

        save();
    }
    else {
        console.log("task is empty")
        alert("add a new task first");
    }
});

// Event delegation for remove and complete buttons
pending_tasks_list.addEventListener("click", (element) => {
    if (element.target.closest(".remove-btn")) {
        let task_to_remove = element.target.closest("li");
        if (task_to_remove) {
            pending_tasks_list.removeChild(task_to_remove);
            removeTask(task_to_remove.id, task_list);
            save();
        }
    } else if (element.target.closest(".complete-btn")) {
        let task = element.target.closest("li");
        let btn = element.target.closest(".complete-btn");
        let img = btn.querySelector("img");
        if (img) {
            img.setAttribute("src", "./images/checklist.png");
            completeTask(task.id, task_list);
            save();
        }
    }
});

console.log(pending_tasks_list.innerHTML);