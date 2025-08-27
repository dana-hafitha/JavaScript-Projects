// creating a to do list app

// first adding new task and add it to the list of tasks 

let new_task_element = document.getElementById("new-task");
let pending_tasks_list = document.getElementById("New-tasks-List");
let task_count = 0;
let add_btn = document.getElementById("add_new_task");

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
        
        let new_task = document.createElement("li");
        new_task.setAttribute("id", `task-${++task_count}`);

        // Create a span for the task text
        let taskText = document.createElement("span");
        taskText.textContent = task;
        new_task.appendChild(taskText);

        // add a remove button for every task
        let removeBtn = document.createElement("button");
        let img1 = document.createElement("img");
        img1.setAttribute("src", "./images/crossed.png");
        removeBtn.appendChild(img1);
        removeBtn.setAttribute("class", "remove-btn");
        new_task.appendChild(removeBtn);

        // adding complete button for every child
        let complete = document.createElement("button");
        let img2 = document.createElement("img");
        img2.setAttribute("src", "./images/round.png");
        complete.appendChild(img2);
        complete.setAttribute("class","complete-btn");
        new_task.appendChild(complete);

        pending_tasks_list.appendChild(new_task);
        save();
    }
    else {
        console.log("task is empty")
        alert("add a new task first");
    }
});

// Event delegation for remove and complete buttons
pending_tasks_list.addEventListener("click", (element) => {
    if (element.target.closest(".remove-btn")) { // finds the closest ancestor of the event target that has the class "remove-btn".
        let li = element.target.closest("li");
        if (li) {
            pending_tasks_list.removeChild(li);
            task_count--;
            console.log(`Removing task`);
            console.log(`task count : ${task_count}`);
            save();
        }
    } else if (element.target.closest(".complete-btn")) {
        let btn = element.target.closest(".complete-btn");
        let img = btn.querySelector("img");
        if (img) {
            img.setAttribute("src", "./images/checklist.png");
            console.log(`task Completed`);
            console.log(`task count : ${task_count}`);
            save();
        }
    }
});

console.log(pending_tasks_list.innerHTML);