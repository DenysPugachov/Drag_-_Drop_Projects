import { Project, ProjectStatus } from "../models/project"

//abstract class for inherit state
abstract class GeneralState<U> {
  //array of functions that should be called whatever something changes (subscription pattern)
  protected listenersArrFn: Listener<U>[] = []

  //add listener function to listener array in this state
  addListener(listenerFn: Listener<U>) {
    this.listenersArrFn.push(listenerFn)
  }
}


type Listener<T> = (items: T) => void

//State for this app
//singleton pattern (одиночка)=> always have ONLY one instance (one State) entire project
export class AppState extends GeneralState<Project[]> {
  private projectsArr: Project[] = []
  private static instance: AppState

  //can NOT be accessed from outside of the class (needed for singleton class)
  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) return this.instance
    //if instance no exist => create new instance
    this.instance = new AppState()
    return this.instance
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    )
    this.projectsArr.push(newProject)
    this.updateListeners()
  }

  switchProjectStatus(projectId: string, newStatus: ProjectStatus) {
    //find project with id in projectArr[]
    const currentProject = this.projectsArr.find(prj => prj.id === projectId)
    //check if project status change (to avoid rendering)
    if (currentProject && currentProject.status !== newStatus) { currentProject.status = newStatus }
    this.updateListeners()
  }

  private updateListeners() {
    for (const listenerFn of this.listenersArrFn) {
      //execute all functions with a copy([].slice()) of projects[]
      listenerFn(this.projectsArr.slice())
    }
  }
}

export const appState = AppState.getInstance()
