import { css, LitElement } from "lit";

class Modal extends LitElement {
  static properties = {
    open: {type: Boolean}
  }

  static styles = css`
    dialog {
      background-color: unset;
      border: none;
      padding: 0px;
    }

    dialog:focus-visible {
      outline: none;
    }

    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
  `

  constructor() {
    super();
    this.dialog = this._setupDialog();
  }

  firstUpdated() {
    this._syncState();
    this._setupEvents();
  }

  render() {
    if (this.hasUpdated) {
      this._syncState();
    }

    return this.dialog;
  }

  show() {
    if (this.dialog.open) { return; }

    this.dialog.showModal();
  }

  hide() {
    if (!this.dialog.open) { return; }
    
    this.dialog.close();
  }

  _syncState() {
    this.open ? this.show() : this.hide();
  }

  _setupDialog() {
    const dialog = document.createElement("dialog");
    const slot = document.createElement("slot");
    slot.addEventListener("pointerdown", event => {
      event.stopPropagation();
    })

    dialog.appendChild(slot);

    return dialog;
  }

  _setupEvents() {
    this.addEventListener("pointerdown", () => {
      this.hide();
    });
  }
}

customElements.define("ncrs-modal", Modal);

export default Modal;