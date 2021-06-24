var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindThis = void 0;
    function BindThis(_target, _method, descriptor) {
        const adjDescriptor = {
            configurable: true,
            get() {
                return descriptor.value.bind(this);
            }
        };
        return adjDescriptor;
    }
    exports.BindThis = BindThis;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, numberOfPeople, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.numberOfPeople = numberOfPeople;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.appState = exports.AppState = void 0;
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
            const newProject = new project_1.Project(Math.random().toString(), title, description, numberOfPeople, project_1.ProjectStatus.Active);
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
    exports.AppState = AppState;
    exports.appState = AppState.getInstance();
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUserInput = void 0;
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
    exports.validateUserInput = validateUserInput;
});
define("components/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
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
    exports.Component = Component;
});
define("components/project-input", ["require", "exports", "decorators/autobind", "state/project-state", "util/validation", "components/base-component"], function (require, exports, autobind_1, project_state_1, validation_1, base_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_component_1.Component {
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
            if (validation_1.validateUserInput(titleValidationConfig) &&
                validation_1.validateUserInput(descriptionValidationConfig) &&
                validation_1.validateUserInput(peopleValidationConfig)) {
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
                project_state_1.appState.addProject(title, description, people);
            }
        }
    }
    __decorate([
        autobind_1.BindThis
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "decorators/autobind", "components/base-component"], function (require, exports, autobind_js_1, base_component_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_component_js_1.Component {
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
        autobind_js_1.BindThis
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "decorators/autobind", "models/project", "state/project-state", "components/base-component", "components/project-item"], function (require, exports, autobind_2, project_2, project_state_2, base_component_2, project_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_component_2.Component {
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
                new project_item_1.ProjectItem(this.element.querySelector("ul").id, projectItem);
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
            project_state_2.appState.switchProjectStatus(prjId, this.ulType === "active" ? project_2.ProjectStatus.Active : project_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const ulEl = this.element.querySelector("ul");
            ulEl.classList.remove("droppable");
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("drop", this.dropHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            project_state_2.appState.addListener((listOfProjects) => {
                this.assignedProjects = listOfProjects.filter(p => {
                    if (this.ulType === "active") {
                        return p.status === project_2.ProjectStatus.Active;
                    }
                    return p.status === project_2.ProjectStatus.Finished;
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
        autobind_2.BindThis
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_2.BindThis
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_2.BindThis
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_1, project_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_input_1.ProjectInput();
    new project_list_1.ProjectList("active");
    new project_list_1.ProjectList("finished");
});
//# sourceMappingURL=bundle.js.map