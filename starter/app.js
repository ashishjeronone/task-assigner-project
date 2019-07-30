// model controller 
const modelConroller = (function() {
    //private methods and func goes here

    //constructor func for creating tasks
    const Task = function(desc, priority, user, taskStatus, id) {
        this.desc = desc;
        this.priority = priority;
        this.user = user;
        this.taskStatus = taskStatus;
        this.id = id;
    }

    Task.prototype.taskClose = function() {
        this.taskStatus = 'close';
    }


    //main app data structure
    let data = {
        taskList: []
    }

    //public methods and func goes here
    return {

        //getting main data
        getData: function() {
            return data;
        },

        //test data into console
        testing: function() {
            console.log(data)
        },

        addListItemtoData: function(obj) {
            var newItem, ID;

            console.log(data.taskList.length)
            if (data.taskList.length != 0) {
                ID = data.taskList[data.taskList.length - 1].id + 1;
            } else {
                ID = 0;
            }

            newItem = new Task(obj.taskDescription, obj.taskPriority, obj.taskAssignedTo, 'open', ID);
            //pushing item to the task array
            data.taskList.push(newItem);
            return newItem;
        },

        deleteListItemFromData: function(id) {

        },

        changeStatus: function(obj) {
            if (obj.id === parseInt(id)) {
                obj.taskClose();
            }
        },

        gettingClickedId: function(id) {
            let idObj;

            idObj = data.taskList.find(function(item) {
                return item.id === parseInt(id);
            })

            return idObj;
        }
    }
})();


//ui controller
const uiController = (function() {
    //private methods and func goes here

    //define dom elements
    const domString = {
        addTask: '.add-task',
        taskDescriptionInput: '#description',
        taskPriorityInput: '#taskPriority',
        assignedToInput: '#assigned',
        listWrapperAppender: '.list-appender',
        allInputs: 'input.form-control',
        cardBody: '.card-body'
    }

    //public methods and func goes here
    return {
        //getting dom strings
        getDomString: function() {
            return domString;
        },


        //getting input value
        getInputData: function() {
            return {
                taskDescription: document.querySelector(domString.taskDescriptionInput).value,
                taskPriority: document.querySelector(domString.taskPriorityInput).value,
                taskAssignedTo: document.querySelector(domString.assignedToInput).value,
            }
        },

        //add list item to ui
        addListItemToui: function(obj) {
            var html, newHTML;

            if (obj.taskStatus === 'open') {
                html = '<div class="card w-100 mb-5 shadow-lg" id="%id%"><div class="card-body"><h5 class="card-title">%title%</h5><p> <span class="badge badge-primary s-open">%status%</span></p><p class="priority"> <span class="lnr lnr-clock"></span> %priority%</p><p class="assigned-to"> <span class="lnr lnr-user"></span> %assigned%</p><button type="button" class="btn btn-warning close-issue mr-3">close</button><button type="button" class="btn btn-danger delete-issue">Delete</button></div></div>';
            } else if (obj.taskStatus === 'close') {
                html = '<div class="card w-100 mb-5 shadow-lg" id="%id%"><div class="card-body"><h5 class="card-title">%title%</h5><p> <span class="badge badge-primary s-close">%status%</span></p><p class="priority"> <span class="lnr lnr-clock"></span> %priority%</p><p class="assigned-to"> <span class="lnr lnr-user"></span> %assigned%</p><button type="button" class="btn btn-warning close-issue mr-3">close</button><button type="button" class="btn btn-danger delete-issue">Delete</button></div></div>';
            }

            newHTML = html.replace('%title%', obj.desc)
            newHTML = newHTML.replace('%status%', obj.taskStatus);
            newHTML = newHTML.replace('%priority%', obj.priority);
            newHTML = newHTML.replace('%assigned%', obj.user);
            newHTML = newHTML.replace('%id%', obj.id);

            //appending html
            document.querySelector(domString.listWrapperAppender).insertAdjacentHTML('beforeend', newHTML);
        },

        //clearing input fields
        clearFields: function() {
            let allInputs = document.querySelectorAll(domString.allInputs);
            for (item of allInputs) {
                item.value = '';
            }

            allInputs[0].focus()
        },

        updateStatusUi: function(object) {

        }
    }
})();


//main app controller
const appController = (function(mdlCtrl, uiCtrl) {
    //private methods and func goes here


    //getting main data from other controllers
    let domData = uiCtrl.getDomString();
    let appData = mdlCtrl.getData();



    //adding item to task function
    const addListItem = function() {
        //getting input values
        const inputValues = uiCtrl.getInputData();

        //update data in data structure
        let newlyItem = mdlCtrl.addListItemtoData(inputValues);

        //update in ui
        uiCtrl.addListItemToui(newlyItem)

        //clearing input fields
        uiCtrl.clearFields();
    }

    //remove item to task function
    const removeListItem = function(e) {
        //get id of clicked card
        let activeListId = e.target.parentElement.parentElement.id;

        if (e.target.classList.contains('close-issue')) {
            //getting clicked object from data
            var clickedIdObject = mdlCtrl.gettingClickedId(activeListId)

            //set status of id in data
            mdlCtrl.changeStatus(clickedIdObject);

            //udate in ui
            uiCtrl.updateStatusUi(clickedIdObject)

        } else if (e.target.classList.contains('delete-issue')) {
            console.log('delete btn clicked')
        }
    }


    //set all event listener here
    const setupEventListener = function() {

        //add issue event on btn click
        document.querySelector(domData.addTask).addEventListener('click', addListItem);

        //adding listener on enter btn keypress
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                addListItem();
            }
        });

        //close issue event listener
        document.querySelector(domData.listWrapperAppender).addEventListener('click', removeListItem)
    }



    //public methods and func goes here
    return {

        //init func for app
        init: function() {
            setupEventListener();
        }
    }
})(modelConroller, uiController);

//calling init func in file body
appController.init()