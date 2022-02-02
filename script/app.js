var CATEGORY_LIST =
    localStorage.getItem("cat_array") == null
        ? [
            {
                name: "Sample",
                color: randomColor(),
                tasks: [
                    {
                        task_ID: Date.now(),
                        task_title: "My first task",
                        status: false,
                        task_begin_date: Date.now(),
                        subtasks: [
                            {
                                subtask_ID: Date.now(),
                                subtask_status: false,
                                subtask_text: "first sub task",
                            },
                        ],
                    },
                ],
            },
        ]
        : JSON.parse(localStorage.getItem("cat_array"));

var categoryContainer = document.querySelector(".category-container");

function addCategory() {
    let category_name = document.getElementById("category-text").value;
    if (category_name == "") {
        alert("Add some name please !");
    } else {
        if (!categoryExists(category_name)) {
            let Category_color = randomColor();
            CATEGORY_LIST.push({
                name: category_name,
                color: Category_color,
                tasks: []
            });
            saveCategoryList();
            categoryContainer.innerHTML += `
                <div class="category" style="border-top: 2px solid ${Category_color};">
                <div class="category-header">
                    <div style="color: ${Category_color}">${category_name}</div>
                    
                    <div>
                    <button  onClick="AddTask(\'${category_name}\')"><i style="color: ${Category_color}" class="fa fa-plus"></i></button>
                    <button  onClick="editCategoryName(\'${category_name}\')"><i style="color: ${Category_color}" class="fa fa-edit"></i></button>
                    <button  onClick="DeleteCategory(\'${category_name}\')"><i style="color: ${Category_color}" class="fa fa-trash"></i></button>

                    
                    </div>

                </div>
                </div> `;
        } else {
            alert("Category already exists");
        }

    }
}

function buildCategoryList(list) {

    var child = categoryContainer.lastElementChild;
    while (child) {
        categoryContainer.removeChild(child);
        child = categoryContainer.lastElementChild;
    }

    list.map((category) => {
        categoryContainer.innerHTML += `
        
        <div class="category" style="border-top: 2px solid ${category.color};">
        <div class="category-header">
            <div style="color: ${category.color}">${category.name}</div>
            <div>
            <button  onClick="AddTask(\'${category.name}\')"><i style="color: ${category.color}" class="fa fa-plus"></i></button>
            <button  onClick="editCategoryName(\'${category.name}\')"><i style="color: ${category.color}" class="fa fa-edit"></i></button>
            <button  onClick="DeleteCategory(\'${category.name}\')"><i style="color: ${category.color}" class="fa fa-trash"></i></button>

            </div>
            

            </div>
        <div class="task-container">
            <!-- task header begin -->
           
            ${category.tasks.map((element) => {
            return `
            <div class="task-header" >
                <div class="task-controller">
                    <div class="task-title ${!element.status ? null : "completed"}">${element.task_title} <span id="begin-date" style="color: ${category.color}">[${element.task_begin_date || "Add date"}] </span></div>
                </div>
                <div style="display: inherit;">
                <input type="date" onChange="addTaskDate(this,\'${category.name}\',${element.task_ID})"/>
                <button onClick="addSubTask(\'${category.name}\',${element.task_ID})"><i class="fa fa-plus"></i></button>
                <button onClick="editTaskName(\'${category.name}\',${element.task_ID})"><i class="fa fa-edit"></i></button>
                <button onClick="deleteTask(\'${category.name}\',${element.task_ID})"><i class="fa fa-trash"></i></button>
                </div>
                
            </div>
            <!-- sub tasks begin  -->
            <div class="subtask-container">
            <ul>
                <li>
                    <dl>
            ${element.subtasks.map((item) => {
                return `<dt class="${!item.subtask_status ? null : "completed"}"> <input type="checkbox" onChange="toggleCompleted(\'${category.name}\',${element.task_ID},${item.subtask_ID})" ${!item.subtask_status ? null : "checked"}> ${item.subtask_text} </dt>`
            }).join("")}
                    </dl>
                </li>
            </ul>
            </div>
    <!-- sub tasks end -->  
        `}).join("")}
            <!-- task header end -->
        </div>
    </div> 
        
        `;
    });

}

window.onload = buildCategoryList(CATEGORY_LIST)

function fun() {
    alert("debug fun")
}


function categoryExists(name) {
    return CATEGORY_LIST.some((item) => {
        return item.name == name;
    });
}

function randomColor() {
    return "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
}

function AddTask(category) {
    let name_task = prompt("Enter task heading", "Groceries")
    let pos = CATEGORY_LIST.map(function (e) { return e.name; }).indexOf(category);

    CATEGORY_LIST[pos].tasks.push({
        task_ID: Date.now(),
        task_title: name_task || "No name",
        task_begin_date: "",
        status: false,
        subtasks: []
    })

    saveCategoryList();
    document.location.reload();
}

function addTaskDate(Entereddate, category, task) {
    let category_pos, task_position;
    [category_pos, task_position] = getPositions(category, task);
    CATEGORY_LIST[category_pos].tasks[task_position].task_begin_date = Entereddate.value
    saveCategoryList();
    document.location.reload();


}

function DeleteCategory(category) {
    let pos = CATEGORY_LIST.map(function (e) { return e.name; }).indexOf(category);
    let text = "This will delete category!\nPress OK to continue.";
    if (confirm(text) == true) {
        CATEGORY_LIST.splice(pos, 1);
    }
    saveCategoryList();
    document.location.reload();
}

function addSubTask(category, task) {
    let name_sub_task = prompt("Enter subtask heading", "Buy Bread")

    let category_pos, task_position;
    [category_pos, task_position] = getPositions(category, task)

    CATEGORY_LIST[category_pos].tasks[task_position].subtasks.push({
        subtask_ID: Date.now(),
        subtask_status: false,
        subtask_text: name_sub_task || "No name",
    })

    if (checkFinished(category, task)) {
        let category_pos, task_position;
        [category_pos, task_position] = getPositions(category, task)
        CATEGORY_LIST[category_pos].tasks[task_position].status = true;
    } else {
        CATEGORY_LIST[category_pos].tasks[task_position].status = false;
    }
    saveCategoryList();
    document.location.reload();
}

function toggleCompleted(category, task, subtask_id) {

    let category_pos, task_position;
    [category_pos, task_position] = getPositions(category, task)
    let subtask_position = CATEGORY_LIST[category_pos].tasks[task_position].subtasks.map((e) => {
        return e.subtask_ID;
    }).indexOf(subtask_id)

    let current_subtask_status = CATEGORY_LIST[category_pos].tasks[task_position].subtasks[subtask_position].subtask_status;
    CATEGORY_LIST[category_pos].tasks[task_position].subtasks[subtask_position].subtask_status = !current_subtask_status;
    saveCategoryList();

    if (checkFinished(category, task)) {
        let category_pos, task_position;
        [category_pos, task_position] = getPositions(category, task)
        CATEGORY_LIST[category_pos].tasks[task_position].status = true;
    } else {
        CATEGORY_LIST[category_pos].tasks[task_position].status = false;
    }
    saveCategoryList();
    document.location.reload();
}



function checkFinished(category, task) {
    let category_pos, task_position;
    [category_pos, task_position] = getPositions(category, task)
    let allDone = CATEGORY_LIST[category_pos].tasks[task_position].subtasks.map((e) => {
        return e.subtask_status
    }).every(v => v === true);
    return allDone
}



function deleteTask(category, task) {
    let category_pos, task_position;
    [category_pos, task_position] = getPositions(category, task)
    CATEGORY_LIST[category_pos].tasks.splice(task_position, 1);
    saveCategoryList();
    document.location.reload();

}

function editTaskName(category, task) {
    let category_pos, task_position;
    [category_pos, task_position] = getPositions(category, task)
    let current_title = CATEGORY_LIST[category_pos].tasks[task_position].task_title
    let new_task_name = prompt("Enter new name", current_title);
    CATEGORY_LIST[category_pos].tasks[task_position].task_title = new_task_name || CATEGORY_LIST[category_pos].tasks[task_position].task_title;
    saveCategoryList();
    document.location.reload();
}

function editCategoryName(category) {
    let pos = CATEGORY_LIST.map(function (e) { return e.name; }).indexOf(category);
    let current_category_name = CATEGORY_LIST[pos].name;
    let new_category_name = prompt("Enter new name", current_category_name);
    CATEGORY_LIST[pos].name = new_category_name || CATEGORY_LIST[pos].name;
    saveCategoryList();
    document.location.reload();
}

function getPositions(category, task) {
    let category_pos = CATEGORY_LIST.map(function (e) { return e.name; }).indexOf(category);
    let task_position = CATEGORY_LIST[category_pos].tasks.map((e) => {
        return e.task_ID;
    }).indexOf(task)

    return [category_pos, task_position]
}

function saveCategoryList() {
    localStorage.setItem("cat_array", JSON.stringify(CATEGORY_LIST));
}

//search functionality.

const inputTag = document.getElementById('search-text');
inputTag.addEventListener('input', searchList)

function searchList(e) {
    console.log("call again")
    let filteredData = []
    const searchValue = e.target.value.toLowerCase();
    let isAvailable = '';
    CATEGORY_LIST.map(category => {
        category.tasks.map(task => {
            isAvailable = task.task_title.toLowerCase().includes(searchValue)
            isAvailable ? !filteredData.includes(category) ? filteredData.push(category) : "" : "";
        })
    })
    buildCategoryList(filteredData)
}

const formatYMD = date => date.toISOString().slice(0, 10);

function CheckIfIn2Days(date1, date2) {
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    const diffInMs = Math.abs(dateTwo - dateOne);
    return (diffInMs / (1000 * 60 * 60 * 24)) <= 2;
}


//filter functionality
const filterTag = document.getElementById('filter');
filterTag.addEventListener('change', filterList)
function filterList(e) {

    let filter_option = e.target.value;
    let today = formatYMD(new Date());
    let filteredData = []
    let isToday = ""
    let isTwoDaysFromNow = ""
    switch (filter_option) {
        case "today":
            CATEGORY_LIST.map(category => {
                category.tasks.map(task => {
                    isToday = task.task_begin_date == today;
                    isToday ? !filteredData.includes(category) ? filteredData.push(category) : "" : "";
                })
            })
            buildCategoryList(filteredData)
            break;
        case "upcoming":
            CATEGORY_LIST.map(category => {
                category.tasks.map(task => {
                    isTwoDaysFromNow = CheckIfIn2Days(task.task_begin_date, today);
                    isTwoDaysFromNow ? !filteredData.includes(category) ? filteredData.push(category) : "" : "";
                })
            })
            buildCategoryList(filteredData)
            break;
        default:
            buildCategoryList(CATEGORY_LIST)
            break;
    }

}