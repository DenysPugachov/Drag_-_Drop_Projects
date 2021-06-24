"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    class Component {
        constructor(templateId, hostElementId, insertAfterBegin, newElementId) {
            this.templateEl = document.getElementById(templateId);
            this.hostEl = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateEl.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId)
                this.element.id = newElementId;
            this.attachEl(insertAfterBegin);
        }
        attachEl(insertAfterBegin) {
            this.hostEl.insertAdjacentElement(insertAfterBegin ? "afterbegin" : "beforeend", this.element);
        }
    }
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    function BindThis(_target, _method, descriptor) {
        const adjDescriptor = {
            configurable: true,
            get() {
                return descriptor.value.bind(this);
            }
        };
        return adjDescriptor;
    }
    App.BindThis = BindThis;
})(App || (App = {}));
var App;
(function (App) {
    function validateUserInput(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLengthString != null &&
            typeof validatableInput.value === "string") {
            isValid = isValid &&
                validatableInput.value.length >= validatableInput.minLengthString;
        }
        if (validatableInput.maxLengthString != null &&
            typeof validatableInput.value === "string") {
            isValid = isValid &&
                validatableInput.value.length <= validatableInput.maxLengthString;
        }
        if (validatableInput.minNumber != null &&
            typeof validatableInput.minNumber === "number") {
            isValid = isValid &&
                validatableInput.value >= validatableInput.minNumber;
        }
        if (validatableInput.maxNumber != null &&
            typeof validatableInput.maxNumber === "number") {
            isValid = isValid &&
                validatableInput.value <= validatableInput.maxNumber;
        }
        return isValid;
    }
    App.validateUserInput = validateUserInput;
})(App || (App = {}));
var App;
(function (App) {
    class GeneralState {
        constructor() {
            this.listenersArrFn = [];
        }
        addListener(listenerFn) {
            this.listenersArrFn.push(listenerFn);
        }
    }
    class AppState extends GeneralState {
        constructor() {
            super();
            this.projectsArr = [];
        }
        static getInstance() {
            if (this.instance)
                return this.instance;
            this.instance = new AppState();
            return this.instance;
        }
        addProject(title, description, numberOfPeople) {
            const newProject = new App.Project(Math.random().toString(), title, description, numberOfPeople, App.ProjectStatus.Active);
            this.projectsArr.push(newProject);
            this.updateListeners();
        }
        switchProjectStatus(projectId, newStatus) {
            const currentProject = this.projectsArr.find(prj => prj.id === projectId);
            if (currentProject && currentProject.status !== newStatus) {
                currentProject.status = newStatus;
            }
            this.updateListeners();
        }
        updateListeners() {
            for (const listenerFn of this.listenersArrFn) {
                listenerFn(this.projectsArr.slice());
            }
        }
    }
    App.AppState = AppState;
    App.appState = AppState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.Component {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleInputEl = this.element.querySelector("#title");
            this.peopleInputEl = this.element.querySelector("#people");
            this.descriptionInputEl = this.element.querySelector("#description");
            this.configure();
        }
        configure() {
            this.element.addEventListener("submit", this.submitHandler);
        }
        renderContent() { }
        gatherUserInput() {
            const enteredTitle = this.titleInputEl.value;
            const enteredDescription = this.descriptionInputEl.value;
            const enteredPeople = this.peopleInputEl.value;
            const titleValidationConfig = {
                value: enteredTitle,
                required: true,
                minLengthString: 4,
            };
            const descriptionValidationConfig = {
                value: enteredDescription,
                required: true,
                minLengthString: 4,
            };
            const peopleValidationConfig = {
                value: enteredPeople,
                required: true,
                minNumber: 1,
                maxNumber: 5,
            };
            if (App.validateUserInput(titleValidationConfig) &&
                App.validateUserInput(descriptionValidationConfig) &&
                App.validateUserInput(peopleValidationConfig)) {
                this.clearInputs();
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
            else {
                alert("Invalid input, please try again.");
                return;
            }
        }
        clearInputs() {
            this.titleInputEl.value = "";
            this.descriptionInputEl.value = "";
            this.peopleInputEl.value = "";
        }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, description, people] = userInput;
                App.appState.addProject(title, description, people);
            }
        }
    }
    __decorate([
        App.BindThis
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, numberOfPeople, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.numberOfPeople = numberOfPeople;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
        constructor(ulType) {
            super("project-list", "app", false, `${ulType}-projects`);
            this.ulType = ulType;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        renderProjects() {
            const ulEl = document.getElementById(`${this.ulType}-project-list`);
            ulEl.innerHTML = "";
            for (const projectItem of this.assignedProjects) {
                new App.ProjectItem(this.element.querySelector("ul").id, projectItem);
            }
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                const ulEl = this.element.querySelector("ul");
                ulEl.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData("text/plain");
            App.appState.switchProjectStatus(prjId, this.ulType === "active" ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const ulEl = this.element.querySelector("ul");
            ulEl.classList.remove("droppable");
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("drop", this.dropHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            App.appState.addListener((listOfProjects) => {
                this.assignedProjects = listOfProjects.filter(p => {
                    if (this.ulType === "active") {
                        return p.status === App.ProjectStatus.Active;
                    }
                    return p.status === App.ProjectStatus.Finished;
                });
                this.renderProjects();
            });
        }
        renderContent() {
            const ulId = `${this.ulType}-project-list`;
            this.element.querySelector("ul").id = ulId;
            this.element.querySelector("h2").textContent = `${this.ulType.toUpperCase()} PROJECTS`;
        }
    }
    __decorate([
        App.BindThis
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.BindThis
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.BindThis
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList("active");
    new App.ProjectList("finished");
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
        constructor(hostElId, project) {
            super("single-project", hostElId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get numberOfPerson() {
            if (this.project.numberOfPeople === 1) {
                return "1 person";
            }
            else {
                return `${this.project.numberOfPeople} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
        }
        dragEndHandler(_) {
            console.log("Item dropped!");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent = this.numberOfPerson + " assigned";
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        App.BindThis
    ], ProjectItem.prototype, "dragStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map