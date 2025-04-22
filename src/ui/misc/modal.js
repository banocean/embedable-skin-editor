import { css, html, LitElement, nothing } from "lit";

class Modal extends LitElement {
  static properties = {
    open: {type: Boolean}
  }

  static styles = css`
    #main {
      display: none;

      position: fixed;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);

      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }

    #main.open {
      display: flex;
    }

    slot {
      width: 100%;
      height: 100%;
    }
  `

  constructor() {
    super();

    document.addEventListener("keydown", event => this._handleKeyDown(event));
  }

  firstUpdated() {
    this._syncState();
  }

  render() {
    return html`
      <div @click=${this.hide} id="main" class="${this.open ? "open" : ""}">
        <slot @click=${this._cancelEvent}></slot>
      </div>
    `
  }

  show() {
    if (this.open) { return; }

    this._showEvent();
    this.open = true;
  }

  hide() {
    if (!this.open) { return; }
    
    this._hideEvent();
    this.open = false;
  }

  _cancelEvent(event) {
    event.stopPropagation();
  }

  _handleKeyDown(event) {
    if (event.key === "Escape") {
      this.hide();
    }
  }

  _syncState() {
    this.open ? this._showEvent() : this._hideEvent();
  }

  _showEvent() {
    this.dispatchEvent(new CustomEvent("show"));
  }

  _hideEvent() {
    this.dispatchEvent(new CustomEvent("hide"));
  }
}

customElements.define("ncrs-modal", Modal);

export default Modal;