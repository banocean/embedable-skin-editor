import { css, LitElement } from "lit";

class Modal extends LitElement {
  static properties = {
    open: {type: Boolean}
  }

  static styles = css`
    dialog {
      background-color: unset;
    }

    dialog:modal {
      border: none;
      padding: 0px;
      margin: 0px;

      width: 100%;
      height: 100%;

      max-width: none;
      max-height: none;
    }

    dialog:focus-visible {
      outline: none;
    }

    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    slot {
      width: 100%;
      height: 100%;
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
    this.dispatchEvent(new CustomEvent("show"));
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

    dialog.addEventListener("close", () => {
      this.dispatchEvent(new CustomEvent("hide"));
    });

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