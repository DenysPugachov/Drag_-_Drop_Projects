/// <reference path="./drag-drop-interfaces.ts" />
/// <reference path="./project-model.ts" />


namespace App {
  //Validation
  interface Validatable {
    value: string | number
    required?: boolean
    minLengthString?: number
    maxLengthString?: number
    minNumber?: number
    maxNumber?: number
  }

  
  function validateUserInput(validatableInput: Validatable) {
    let isValid = true

    if (validatableInput.required) {
      isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    // "value != null" => null && undefined
    if (validatableInput.minLengthString != null &&
      typeof validatableInput.value === "string") {
      isValid = isValid &&
        validatableInput.value.length >= validatableInput.minLengthString
    }

    if (validatableInput.maxLengthString != null &&
      typeof validatableInput.value === "string") {
      isValid = isValid &&
        validatableInput.value.length <= validatableInput.maxLengthString
    }

    if (validatableInput.minNumber != null &&
      typeof validatableInput.minNumber === "number") {
      isValid = isValid &&
        validatableInput.value >= validatableInput.minNumber
    }

    if (validatableInput.maxNumber != null &&
      typeof validatableInput.maxNumber === "number") {
      isValid = isValid &&
        validatableInput.value <= validatableInput.maxNumber
    }

    return isValid
  }


  //autobind decorator
  function BindThis(_target: any, _method: string, descriptor: PropertyDescriptor) {
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        return descriptor.value.bind(this)
      }
    }
    return adjDescriptor
  }


  type Listener<T> = (items: T) => void

  //abstract class for inherit state
  abstract class GeneralState<U> {
    //array of functions that should be called whatever something changes (subscription pattern)
    protected listenersArrFn: Listener<U>[] = []

    //add listener function to listener array in this state
    addListener(listenerFn: Listener<U>) {
      this.listenersArrFn.push(listenerFn)
    }
  }


  //State for this app
  //singleton pattern (одиночка)=> always have ONLY one instance (one State) entire project
  class AppState extends GeneralState<Project[]> {
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

  const appState = AppState.getInstance()


  //Base class for Component
  //'abstract' class => never insatiate this directly, only for inheritance(extend)
  //Generic types<T,U> =>uses when we want set type form outside (when set this parameters)
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement
    hostEl: T
    element: U

    constructor(
      templateId: string,
      hostElementId: string,
      insertAfterBegin: boolean,
      newElementId?: string,
    ) {
      this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement
      this.hostEl = document.getElementById(hostElementId)! as T

      const importedNode = document.importNode(this.templateEl.content, true)
      this.element = importedNode.firstElementChild as U

      if (newElementId) this.element.id = newElementId

      this.attachEl(insertAfterBegin)
    }

    private attachEl(insertAfterBegin: boolean) {
      this.hostEl.insertAdjacentElement(insertAfterBegin ? "afterbegin" : "beforeend", this.element)
    }

    //'abstract' method => require to add this method to an instance
    abstract configure(): void
    abstract renderContent(): void
  }


  //class responsible to render single project item
  class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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


  //Project list class
  class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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


  //project input class
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement
    descriptionInputEl: HTMLInputElement
    peopleInputEl: HTMLInputElement

    constructor() {
      super("project-input", "app", true, "user-input")
      //access to inputs
      this.titleInputEl = this.element.querySelector("#title")! as HTMLInputElement
      this.peopleInputEl = this.element.querySelector("#people")! as HTMLInputElement
      this.descriptionInputEl = this.element.querySelector("#description")! as HTMLInputElement

      this.configure()
    }

    //public method FIRST!!!
    configure() {
      this.element.addEventListener("submit", this.submitHandler)
    }

    renderContent() { }

    //gather = собирать
    private gatherUserInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputEl.value
      const enteredDescription = this.descriptionInputEl.value
      const enteredPeople = this.peopleInputEl.value

      //configuration obj for validation
      const titleValidationConfig = {
        value: enteredTitle,
        required: true,
        minLengthString: 4,
      }

      const descriptionValidationConfig = {
        value: enteredDescription,
        required: true,
        minLengthString: 4,
      }

      const peopleValidationConfig = {
        value: enteredPeople,
        required: true,
        minNumber: 1,
        maxNumber: 5,
      }

      if (
        validateUserInput(titleValidationConfig) &&
        validateUserInput(descriptionValidationConfig) &&
        validateUserInput(peopleValidationConfig)
      ) {
        this.clearInputs()
        return [enteredTitle, enteredDescription, +enteredPeople]
      } else {
        alert("Invalid input, please try again.")
        return
      }
    }

    private clearInputs() {
      this.titleInputEl.value = ""
      this.descriptionInputEl.value = ""
      this.peopleInputEl.value = ""
    }

    @BindThis
    private submitHandler(event: Event) {
      event.preventDefault()
      const userInput = this.gatherUserInput()
      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput
        appState.addProject(title, description, people)
      }
    }

  }


  new ProjectInput()
  new ProjectList("active")
  new ProjectList("finished")

}
// end 12.Inheritance & state management