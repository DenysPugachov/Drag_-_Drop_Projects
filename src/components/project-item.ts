import { BindThis } from "../decorators/autobind.js"
import { Draggable } from "../models/drag-drop.js" // extension .js because it pure JS feature!
import { Project } from "../models/project.js"
import { Component } from "./base-component.js"


//class responsible to render single project item
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  //store project obj inside this class
  public project: Project

  //CONVENTION!=> get() and set() below the fields (above the constructor())
  get numberOfPerson() {
    if (this.project.numberOfPeople === 1) {
      return "1 person"
    } else {
      return `${this.project.numberOfPeople} persons`
    }
  }

  constructor(hostElId: string, project: Project) {
    super("single-project", hostElId, false, project.id)
    this.project = project
    this.configure()
    this.renderContent()
  }

  @BindThis
  dragStartHandler(event: DragEvent) {
    //catch plain/text from darg obj
    event.dataTransfer!.setData("text/plain", this.project.id)
    //planing to move brag obj
    // event.dataTransfer!.effectAllowed = "move"
  }

  dragEndHandler(_: DragEvent) {
    console.log("Item dropped!");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler)
    this.element.addEventListener("dragend", this.dragEndHandler)
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title
    this.element.querySelector("h3")!.textContent = this.numberOfPerson + " assigned" // this.person uses getter
    this.element.querySelector("p")!.textContent = this.project.description
  }
}
