var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BindThis } from "../decorators/autobind.js";
import { ProjectStatus } from "../models/project.js";
import { appState } from "../state/project-state.js";
import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";
export class ProjectList extends Component {
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
            new ProjectItem(this.element.querySelector("ul").id, projectItem);
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
        appState.switchProjectStatus(prjId, this.ulType === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    dragLeaveHandler(_) {
        const ulEl = this.element.querySelector("ul");
        ulEl.classList.remove("droppable");
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        appState.addListener((listOfProjects) => {
            this.assignedProjects = listOfProjects.filter(p => {
                if (this.ulType === "active") {
                    return p.status === ProjectStatus.Active;
                }
                return p.status === ProjectStatus.Finished;
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
    BindThis
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    BindThis
], ProjectList.prototype, "dropHandler", null);
__decorate([
    BindThis
], ProjectList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map