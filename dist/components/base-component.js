export class Component {
    constructor(templateId, hostElementId, insertAfterBegin, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attachEl(insertAfterBegin);
    }
    attachEl(insertAfterBegin) {
        this.hostEl.insertAdjacentElement(insertAfterBegin ? "afterbegin" : "beforeend", this.element);
    }
}
//# sourceMappingURL=base-component.js.map