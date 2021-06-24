var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BindThis } from "../decorators/autobind.js";
import { appState } from "../state/project-state.js";
import { validateUserInput } from "../util/validation.js";
import { Component } from "./base-component.js";
export class ProjectInput extends Component {
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
        if (validateUserInput(titleValidationConfig) &&
            validateUserInput(descriptionValidationConfig) &&
            validateUserInput(peopleValidationConfig)) {
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
            appState.addProject(title, description, people);
        }
    }
}
__decorate([
    BindThis
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map