import interact from "interactjs";
import { css, html, LitElement } from "lit";

const CLOSE_THRESHOLD = 100;
const CLOSE_SPEED_THRESHOLD = 25;

class MobileDrawer extends LitElement {
  static properties = {
    open: {type: Boolean, reflect: true},
  }

  static styles = css`
    :host {
      display: none;
      align-items: flex-end;
      position: absolute;
      inset: 0px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, calc(0.75 - var(--close-progress, 0)));
      backdrop-filter: blur(calc(4px * calc(1 - var(--close-progress, 0))));
      padding-top: 4rem;
    }

    #drawer {
      background-color: rgb(26, 26, 26);
      height: 100%;
      width: 100%;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    #handle-section {
      display: flex;
      justify-content: center;
      padding: 0.25rem;
      padding-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    #handle {
      width: 4rem;
      height: 0.25rem;
      background-color: rgb(156, 163, 175);
      border-radius: 0.25rem;
    }

    :host([open]) {
      display: flex;
    }

    :host([open]) #drawer {
      transform: translateY(0%);
    }

    :host([open]:not(.open)) #drawer {
      transform: translateY(0%);
      animation: open 0.5s cubic-bezier(0.32,0.72,0,1);
    }

    :host(.closing) {
      animation: fade 0.5s;
    }

    :host(.closing) #drawer {
      animation: close 0.5s cubic-bezier(0.32,0.72,0,1);
    }

    :host(.snap) #drawer {
      animation: snap 0.5s cubic-bezier(0.32,0.72,0,1);
    }

    slot[name=title] {
      pointer-events: none;
    }

    @keyframes open {
      from {
        transform: translateY(100%);
      }

      to {
        transform: translateY(0%);
      }
    }

    @keyframes snap {
      to {
        transform: translateY(0%);
      }
    }

    @keyframes close {
      to {
        transform: translateY(100%);
      }
    }

    @keyframes fade {
      to {
        opacity: 0;
      }
    }
  `;

  constructor() {
    super();

    this._setupEvents();
  }
  drawer;
  _translate = 0;
  _shouldClose = false;

  firstUpdated() {
    this._setupInteract();
  }

  render() {
    if (this.open) {
      document.querySelector("html").style.setProperty("overscroll-behavior-y", "none");
    } else {
      document.querySelector("html").style.removeProperty("overscroll-behavior-y");
    }

    return html`
      <div id="drawer" part="drawer">
        <div id="handle-section">
          <div id="handle" part="handle"></div>
        </div>
        <div part="body">
          <slot></slot>
        </div>
      </div>
    `;
  }

  show() {
    this.open = true;
  }

  hide() {
    this.classList.add("closing");
  }

  _setupInteract() {
    this.drawer = this.renderRoot.getElementById("drawer");
    this.drawer.addEventListener("animationend", event => this._onAnimationEnd(event));
    this.drawer.addEventListener("click", event => event.stopImmediatePropagation());

    interact(this).draggable({
      startAxis: "y",
      lockAxis: "y",
      listeners: {
        move: this._onDragMove.bind(this),
        end: this._onDragEnd.bind(this),
      }
    });
  }

  _setTranslate(value) {
    this._translate = Math.max(value, 0);

    const progress = (this._translate / this.drawer.clientHeight);

    this.style.setProperty("--close-progress", progress);
    this.drawer.style.setProperty("transform", `translateY(${this._translate}px)`);
  }

  _onDragMove(event) {
    this._setTranslate(this._translate + event.delta.y);

    if (event.delta.y > CLOSE_SPEED_THRESHOLD) {
      this._shouldClose = true;
    } else if (event.delta.y < 0) {
      this._shouldClose = false;
    }
  }

  _onDragEnd() {
    if (this._translate > CLOSE_THRESHOLD || this._shouldClose) {
      this.classList.add("closing");
    } else if (this._translate > 0) {
      this.classList.add("snap");
    }
  }

  _onAnimationEnd(event) {
    if (event.animationName === "open") {
      this.classList.add("open");
    }

    if (event.animationName === "close") {
      this.open = false;
      this._translate = 0;
      this.drawer.style.removeProperty("transform");
      this.style.removeProperty("--close-progress");
      this.classList.remove("closing", "open");
    }

    if (event.animationName === "snap") {
      this.classList.remove("snap");
      this._setTranslate(0);
    }
  }

  _setupEvents() {
    this.addEventListener("click", () => {
      this.hide();
    })
  }
}

customElements.define("ncrs-mobile-drawer", MobileDrawer);
export default MobileDrawer;