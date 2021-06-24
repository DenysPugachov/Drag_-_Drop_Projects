var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BindThis } from "../decorators/autobind.js";
import { Component } from "./base-component.js";
export class ProjectItem extends Component {
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
    BindThis
], ProjectItem.prototype, "dragStartHandler", null);
//# sourceMappingURL=project-item.js.map