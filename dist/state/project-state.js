import { Project, ProjectStatus } from "../models/project.js";
class GeneralState {
    constructor() {
        this.listenersArrFn = [];
    }
    addListener(listenerFn) {
        this.listenersArrFn.push(listenerFn);
    }
}
export class AppState extends GeneralState {
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
        const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active);
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
export const appState = AppState.getInstance();
//# sourceMappingURL=project-state.js.map