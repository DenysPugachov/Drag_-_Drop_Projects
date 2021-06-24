/// <reference path="./base-component.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../state/project-state.ts"/>
/// <reference path="../models/drag-drop.ts"/>
/// <reference path="../models/project.ts"/>

namespace App {
  //Project list class
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[]

    constructor(private ulType: "active" | "finished") {
      super("project-list", "app", false, `${ulType}-projects`)
      this.assignedProjects = []
      this.configure()
      this.renderContent()
    }

    private renderProjects() {
      const ulEl = document.getElementById(`${this.ulType}-project-list`)! as HTMLUListElement
      //clear <ul> content before add new one
      ulEl.innerHTML = ""
      for (const projectItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem)
      }
    }

    @BindThis
    dragOverHandler(event: DragEvent) {
      //alow drop only obj witch dataTransfer type is "text/plain"
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        //by default JS is NOT allowing dropping
        event.preventDefault()
        const ulEl = this.element.querySelector("ul")!
        ulEl.classList.add("droppable")
      }
    }

    @BindThis
    dropHandler(event: DragEvent) {
      //.getData("type") => data from .setData("type", id)
      const prjId = event.dataTransfer!.getData("text/plain")
      //switch projectStatus depend of a droppable area name, where this project is dropped
      appState.switchProjectStatus(prjId, this.ulType === "active" ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @BindThis
    dragLeaveHandler(_: DragEvent) {
      const ulEl = this.element.querySelector("ul")!
      ulEl.classList.remove("droppable")
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler)
      this.element.addEventListener("drop", this.dropHandler)
      this.element.addEventListener("dragleave", this.dragLeaveHandler)

      //add listener function to the appState
      appState.addListener((listOfProjects: Project[]) => {
        this.assignedProjects = listOfProjects.filter(p => {
          if (this.ulType === "active") {
            return p.status === ProjectStatus.Active
          }
          return p.status === ProjectStatus.Finished
        })
        this.renderProjects()
      })
    }

    renderContent() {
      const ulId = `${this.ulType}-project-list`
      this.element.querySelector("ul")!.id = ulId
      this.element.querySelector("h2")!.textContent = `${this.ulType.toUpperCase()} PROJECTS`
    }
  }
}