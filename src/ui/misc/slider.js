import { LitElement, css, html } from "lit";
import { clamp } from "../../helpers";

class Slider extends LitElement {
  static properties = {
    progress: { reflect: true, type: Number },
    steps: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      cursor: pointer;
    }

    :host(:focus) {
      outline: white solid 1px;
    }

    #background {
      all: unset;
      display: block;
      width: 100%;
      height: 100%;
    }

    #cursor {
      pointer-events: none;
      position: absolute;
      top: 0px;
      height: 100%;
      width: 4px;
      outline: 0.125rem solid white;
      border-radius: 0.25rem;
    }

    :host(:hover) > #cursor {
      outline: 0.125rem solid #f5f8cc;
    }
  `;

  constructor() {
    super();

    this.progress = this.progress || 1;
    this.steps = this.steps || 256;

    const scope = this;

    const pointerMove = function (event) {
      scope.onMove(event);
    };

    const pointerUp = function (event) {
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerup", pointerUp);
    };

    this._onPointerDown = () => {
      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerup", pointerUp);
    };

    this._setupResizeObserver();
  }

  attributeChangedCallback(name, _old, value) {
    super.attributeChangedCallback(name, _old, value);

    if (name === "progress") {
      this.dispatchEvent(new CustomEvent("slider-change", { detail: { progress: this.progress } }));
    }
  }

  render() {
    return html`
      <button @pointerdown=${this.onClick} @keydown=${this.onKeyDown} @wheel=${this.onWheel} id="background"></button>
      <div id="cursor" part="cursor" style="left: ${this._getPos() - 2}px;"></div>
    `;
  }

  onClick(event) {
    this.setProgress(event.layerX / this.clientWidth);
    this._onPointerDown();
  }

  onMove(event) {
    const rect = this.getBoundingClientRect();
    this.setProgress((event.clientX - rect.x) / this.clientWidth);
  }

  onWheel(event) {
    event.preventDefault();

    const stepSize = 1 / this.steps;
    const shiftMultiplier = 5;

    let step = stepSize;
    if (event.shiftKey) {
      step *= shiftMultiplier;
    }

    if (event.deltaY < 0) {
      step *= -1;
    }

    this.setProgress(this.progress + step);
  }

  onKeyDown(event) {
    if (event.key === "Tab") {
      return;
    }
    event.preventDefault();

    const key = event.key;
    const stepSize = 1 / this.steps;
    const shiftMultiplier = 5;

    let step = stepSize;
    if (event.shiftKey) {
      step *= shiftMultiplier;
    }

    let progress = this.progress;

    switch (key) {
      case "ArrowRight":
        progress += step;
        break;
      case "ArrowLeft":
        progress -= step;
        break;
      case "ArrowUp":
        progress += step;
        break;
      case "ArrowDown":
        progress -= step;
        break;
    }

    this.setProgress(progress);
  }

  setProgress(x) {
    this.progress = clamp(x, 0, 1);
  }

  _getPos() {
    return this.clientWidth * this.progress;
  }

  _setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.requestUpdate();
    })

    resizeObserver.observe(this);
  }
}

customElements.define("ncrs-slider", Slider);

export default Slider;