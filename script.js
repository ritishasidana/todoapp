document.addEventListener('DOMContentLoaded', () => {  //This ensures the JavaScript runs only after the HTML content is fully loaded
    const todoinput = document.getElementById("todo-input");
    const addtaskbtn = document.getElementById("add-task-btn");
    const todolist = document.getElementById("todo-list");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];  //JSON.parse(...)-> converts the saved string back into a JavaScript array of objects. load previously saved tasks from the browser’s localStorage when the page loads. If nothing is stored yet, defaults to an empty array [].
    tasks.forEach((task) => rendertask(task));   //It sends each task one by one to a function called rendertask(task).

    addtaskbtn.addEventListener("click", () => {
        const tasktext = todoinput.value.trim();
        if (tasktext === "") return;
        const newtask = {
            id: Date.now(),  //A unique ID using Date.now().
            text: tasktext,
            completed: false,
        };

        tasks.push(newtask);      //Adds the task to the list
        rendertask(newtask);      // render the task, Displays it
        savetasks();              // Saves the updated task list to localStorage
        todoinput.value = "";     // clears the input field.
    });

    function rendertask(task) {
        const li = document.createElement("li");
        li.setAttribute("data-id", task.id);  //Adds a custom attribute data-id="123456789" to help identify the task uniquely
        if (task.completed) li.classList.add("completed");  //If the task is already marked as done, apply a completed class 

        li.innerHTML = ` 
            <span>${task.text}</span>      
            <button>delete</button>
        `;
        //Fills the list item with:  The task text inside a <span>  and A "delete" <button>

        // Toggle completion
        li.addEventListener("click", (e) => {  ////You're adding a click listener to the <li> element (a task).
            if (e.target.tagName === 'BUTTON') return;  //Skips toggling if delete button is clicked , e.target.tagName → the HTML tag name of that clicked element 
            task.completed = !task.completed;   //This toggles the completed state of the task: If false, it becomes true. If true, it becomes false.
            li.classList.toggle('completed');   //Adds or removes the completed CSS class from the <li> element.
            savetasks();      //After toggling the task’s completed status, you save the updated task list to localStorage.
        });  
            //completed class->  This will appear with a line through it and slightly faded.

        // Delete task
        li.querySelector("button").addEventListener("click", (e) => {  //Finds the <button> inside the current <li>, and adds a click listener to it.
            e.stopPropagation();     //	Stops the delete button from also triggering the complete-toggling on the <li>
            tasks = tasks.filter((t) => t.id !== task.id);  // deletes a task from the tasks array using the .filter() method.
            li.remove();   //task disappears visually from the list.
            savetasks();    //After modifying the tasks array, it saves the new list to localStorage so changes persist after reload.
        });
            // filter method-> Keep task t only if its id is NOT equal to the current task.id (i.e., the one being deleted).

        todolist.appendChild(li); //It adds the <li> to the actual list <ul> in the page.
    }

    function savetasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));  //Saves the tasks array as a JSON string in localStorage.
    }
    //localStorage.setItem(key, value)
    //✅ JSON.stringify(tasks)
    //Converts the tasks array (which contains task objects) into a string format.
    //localStorage can only store strings, not objects or arrays directly.
});
