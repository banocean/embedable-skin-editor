import { css, html, LitElement } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import Color from "color";
import { clamp } from "../../helpers";
import NAMED_COLORS from "./named_colors";

class ColorPicker extends LitElement {
  static properties = {
    hue: {},
    saturation: {},
    lightness: {},
    alpha: {},
  };

  static styles = css`
    :host {
      position: relative;
      display: block;
    }

    :host > div {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      --current-hue: 0deg;
      --current-color: #ff0000;
      --current-color-alpha: #ff0000;
    }

    button {
      all: unset;
    }

    #gradient {
      flex-grow: 1;
      border-radius: 0.25rem;
      background-image: linear-gradient(rgba(0, 0, 0, 0), #000),
        linear-gradient(90deg, #fff, hsl(var(--current-hue), 100%, 50%));
    }

    #gradient::part(cursor) {
      background-color: var(--current-color);
    }

    #sliders {
      box-sizing: border-box;
      margin-top: 0.75rem;
      width: 100%;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    #hue-slider {
      width: 100%;
      height: 0.75rem;
      border-radius: 0.25rem;
      background-image: linear-gradient(
        to right,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(0, 100%, 50%)
      );
    }

    #hue-slider::part(cursor) {
      background-color: hsl(var(--current-hue) 100% 50%);
    }

    #alpha-slider {
      margin-top: 0.5rem;
      width: 100%;
      height: 0.75rem;
      border-radius: 0.25rem;
      background: linear-gradient(to right, transparent, var(--current-color)),
        repeating-conic-gradient(#aaa 0% 25%, #888 0% 50%) 50%/ 8px 8px;
    }

    #alpha-slider::part(cursor) {
      background-color: var(--current-color-alpha);
    }

    #input {
      margin-top: 0.5rem;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    #color-button {
      display: block;
      width: 2rem;
      height: 2rem;
      border-radius: 100%;
      background: linear-gradient(var(--current-color-alpha), var(--current-color-alpha)),
        repeating-conic-gradient(#aaa 0% 25%, #888 0% 50%) 50%/ 8px 8px;
      cursor: pointer;
    }

    #color-button:focus {
      outline: white solid 1px;
    }

    #color-input {
      display: none;
    }

    #text-input {
      border-radius: 4px;
      color: white;
      text-align: center;
      background-color: #131315;
      border-style: solid;
      border-width: 2px;
      border-radius: 6px;
      border-color: #313436;
      box-shadow: none;
    }

    #text-input:focus {
      border-color: white;
      outline: none;
    }
  `;

  constructor() {
    super();

    this.hue = 0;
    this.saturation = 0;
    this.lightness = 0;
    this.alpha = 1;

    this.gradient = this._createGradient();
    this.hueSlider = this._createHueSlider();
    this.alphaSlider = this._createAlphaSlider();
  }
  picker;

  render() {
    const color = this.getColor();
    const colorWithAlpha = this.getColorWithAlpha();

    const colorInput = document.createElement("input");
    colorInput.id = "color-input";
    colorInput.type = "color";
    colorInput.value = colorWithAlpha.string();
    colorInput.addEventListener("change", (event) => this.setColor(event.target.value));

    const textInput = document.createElement("input");
    textInput.id = "text-input";
    textInput.type = "text";
    textInput.value = this._colorString(colorWithAlpha);
    textInput.oninput = this._onTextInput.bind(this);
    textInput.onchange = this._onTextChange.bind(this);

    function showColorInput() {
      colorInput.click();
    }

    const styles = {
      "--current-hue": `${this.hue}deg`,
      "--current-color": color.string(),
      "--current-color-alpha": colorWithAlpha.string(),
    };

    this.dispatchEvent(new CustomEvent("color-change", { detail: { color: this.getColorWithAlpha() } }));

    if (colorWithAlpha.isLight()) {
      this.gradient.classList.add("light");
    } else {
      this.gradient.classList.remove("light");
    }

    return html`
      <div style=${styleMap(styles)}>
        ${this.gradient}
        <div id="sliders">
          ${this.hueSlider}
          ${this.alphaSlider}
        </div>
        <div id="input">
          <button @click=${showColorInput} id="color-button" aria-label="Open system color picker"></button>
          ${colorInput} ${textInput}
        </div>
      </div>
    `;
  }

  getColor() {
    return Color({ h: this.hue, s: this.saturation, v: this.lightness });
  }

  setColor(color) {
    const newColor = Color(color).hsv();

    this.gradient.progressX = newColor.saturationv() / 100;
    this.gradient.progressY = (100 - newColor.value()) / 100;

    this.hueSlider.progress = newColor.hue() / 360;
    this.alphaSlider.progress = newColor.alpha();
  }

  getColorWithAlpha() {
    return this.getColor().alpha(this.alpha);
  }

  _createGradient() {
    const gradient = new ColorPickerRegion();
    gradient.id = "gradient";
    gradient.addEventListener("region-change", event => { this._gradientChanged(event) });

    return gradient;
  }

  _createHueSlider() {
    const hueSlider = new ColorPickerSlider();
    hueSlider.id = "hue-slider";
    hueSlider.addEventListener("slider-change", event => { this._hueChanged(event) });

    return hueSlider;
  }

  _createAlphaSlider() {
    const alphaSlider = new ColorPickerSlider();
    alphaSlider.id = "alpha-slider";
    alphaSlider.addEventListener("slider-change", event => { this._alphaChanged(event) });

    return alphaSlider;
  }

  _gradientChanged(event) {
    const px = event.detail.progressX;
    const py = event.detail.progressY;

    this.saturation = clamp(px * 100, 0, 100);
    this.lightness = clamp(100 - py * 100, 0, 100);
  }

  _hueChanged(event) {
    this.hue = event.detail.progress * 360;
  }

  _alphaChanged(event) {
    this.alpha = event.detail.progress;
  }

  _onTextInput(event) {
    let value = event.target.value.toUpperCase();
    value = value.replaceAll("#", "");

    event.target.value = "#" + value;
  }

  _onTextChange(event) {
    const oldValue = this.getColorWithAlpha().hexa();

    if (event.target.value === "#MOXVALLIX") {
      this.dispatchEvent(new CustomEvent("easteregg", { detail: event.target.value }));
    }

    const colorName = event.target.value.toLowerCase().replaceAll("#", "").replaceAll(" ", "_");
    if (Object.keys(NAMED_COLORS).includes(colorName)) {
      event.target.value = NAMED_COLORS[colorName];
    }

    try {
      this.setColor(event.target.value);
    } catch (_) {
      event.target.value = oldValue;
    }
  }

  _colorString(color) {
    if (color.alpha() == 1) {
      return color.hex();
    }

    return color.hexa();
  }
}

class ColorPickerSlider extends LitElement {
  static properties = {
    progress: { reflect: true },
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

    const stepSize = 0.00390625;
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
    const stepSize = 0.00390625; // 1 / 256
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

class ColorPickerRegion extends LitElement {
  static properties = {
    progressX: { reflect: true },
    progressY: { reflect: true },
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
      height: 8px;
      width: 8px;
      outline: 0.125rem solid white;
      border-radius: 100%;
    }

    :host(.light) #cursor {
      outline-color: black;
    }
  `;

  constructor() {
    super();

    this.progressX = this.progressX || 1;
    this.progressY = this.progressY || 0;

    const scope = this;

    const pointerMove = function (event) {
      scope.onMove(event);
    };

    const pointerUp = function (_event) {
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerup", pointerUp);
    };

    this._onPointerDown = () => {
      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerup", pointerUp);
    };

    this._setupResizeObserver();
  }

  render() {
    const pos = this._getPos();

    return html`
      <button @pointerdown=${this.onClick} @keydown=${this.onKeyDown} id="background"></button>
      <div id="cursor" part="cursor" style="left: ${pos.x - 4}px; top: ${pos.y - 4}px;"></div>
    `;
  }

  attributeChangedCallback(name, _old, value) {
    super.attributeChangedCallback(name, _old, value);

    if (name === "progressx" || name === "progressy") {
      this.dispatchEvent(
        new CustomEvent("region-change", { detail: { progressX: this.progressX, progressY: this.progressY } })
      );
    }
  }

  onClick(event) {
    this._onPointerDown();
    this.onMove(event);
  }

  onMove(event) {
    const rect = this.getBoundingClientRect();
    this.setProgress((event.clientX - rect.x) / this.clientWidth, (event.clientY - rect.y) / this.clientHeight);
  }

  onKeyDown(event) {
    if (event.key === "Tab") {
      return;
    }
    event.preventDefault();

    const key = event.key;
    const stepSize = 0.00390625; // 1 / 256
    const shiftMultiplier = 5;

    let step = stepSize;
    if (event.shiftKey) {
      step *= shiftMultiplier;
    }

    let progressX = this.progressX;
    let progressY = this.progressY;

    switch (key) {
      case "ArrowRight":
        progressX += step;
        break;
      case "ArrowLeft":
        progressX -= step;
        break;
      case "ArrowUp":
        progressY -= step;
        break;
      case "ArrowDown":
        progressY += step;
        break;
    }

    this.setProgress(progressX, progressY);
  }

  setProgress(x, y) {
    this.progressX = clamp(x, 0, 1);
    this.progressY = clamp(y, 0, 1);
  }

  _getPos() {
    return {
      x: this.clientWidth * this.progressX,
      y: this.clientHeight * this.progressY,
    };
  }

  _setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.requestUpdate();
    })

    resizeObserver.observe(this);
  }
}

customElements.define("ncrs-color-picker", ColorPicker);
customElements.define("ncrs-color-picker-slider", ColorPickerSlider);
customElements.define("ncrs-color-picker-region", ColorPickerRegion);

export default ColorPicker;
