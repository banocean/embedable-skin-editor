import { css, html, LitElement } from "lit";
import { clamp } from "three/src/math/MathUtils.js";

class Window extends LitElement {
  static properties = {
    name: {},
  }

  static styles = css`
    :host {
      --background-color: white;

      position: fixed;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #565758;
      border-radius: 0.25rem;
      color: white;
      resize: both;
      background-color: var(--background-color);
      box-sizing: border-box;

      top: 0px;
      left: 0px;
      z-index: 100;
    }

    #header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-image: linear-gradient(to top, #222528, #2a2d2f);
      padding: 0.375rem;
      margin: -0.125rem -0.125rem;
      cursor: grab;
      min-width: min-content;
      box-sizing: border-box;
    }

    #header h2 {
      margin: 0px;
      font-size: medium;
      font-weight: normal;
      user-select: none;
      pointer-events: none;
    }

    #header button {
      all: unset;
      display: block;
      cursor: pointer;
      user-select: none;
      height: 18px;
    }

    #header button > svg {
      height: 18px;
    }

    #body {
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
  `

  constructor() {
    super();

    this._dragMoveEvent = this._dragMove.bind(this);
    this._dragEndEvent = this._dragEnd.bind(this);
  }
  header;
  _offsetX;
  _offsetY;

  firstUpdated() {
    this.header = this.shadowRoot.getElementById("header");
    this.body = this.shadowRoot.getElementById("body");
    this._setupHeaderEvents();

    this.dispatchEvent(new CustomEvent("ready"));
  }

  render() {
    return html`
      <div id="header">
        <h2>${this.name}</h2>
        <button @click=${this.close} title="Close window.">
          <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
      </div>
      <div id="body">
        <slot></slot>
      </div>
    `
  }

  close() {
    this.remove();
  }

  setPosition(x, y) {
    const bodyRect = document.body.getBoundingClientRect();
    const selfRect = this.getBoundingClientRect();

    this.style.top = `${clamp(y, 0, bodyRect.height - selfRect.height)}px`;
    this.style.left = `${clamp(x, 0, bodyRect.width - selfRect.width)}px`;
  }

  getInnerBounds() {
    if (!this.hasUpdated) { return; }

    return this.body.getBoundingClientRect();
  }

  _dragStart(event) {
    if (event.target !== this.header) { return; }
    if (event.pointerType === "mouse" && event.buttons !== 1) { return; }

    this._offsetX = event.offsetX;
    this._offsetY = event.offsetY;
    
    this.header.style.cursor = "grabbing";

    event.preventDefault();

    document.addEventListener("pointermove", this._dragMoveEvent);
    document.addEventListener("pointerup", this._dragEndEvent);
  }

  _dragMove(event) {
    const posX = event.clientX - this._offsetX;
    const posY = event.clientY - this._offsetY;
    
    this.setPosition(posX, posY);

    event.preventDefault();
  }

  _dragEnd(_event) {
    this.header.style.cursor = "grab";

    document.removeEventListener("pointermove", this._dragMoveEvent);
    document.removeEventListener("pointerup", this._dragEndEvent);
  }

  _setupHeaderEvents() {
    this.header.addEventListener("pointerdown", this._dragStart.bind(this));
  }
}

customElements.define("ncrs-window", Window);

export default Window;