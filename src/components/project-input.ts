import { BindThis } from "../decorators/autobind.js"
import { appState } from "../state/project-state.js"
import { validateUserInput } from "../util/validation.js"
import { Component } from "./base-component.js"


//project input class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
