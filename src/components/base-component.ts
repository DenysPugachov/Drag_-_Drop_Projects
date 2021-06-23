namespace App {
  //Base class for Component
  //'abstract' class => never insatiate this directly, only for inheritance(extend)
  //Generic types<T,U> =>uses when we want set type form outside (when set this parameters)
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

}