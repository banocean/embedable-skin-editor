import Color from "color";
import { clamp } from "../../../../../helpers";
import Tab from "../../../../misc/tab";
import { css, html } from "lit";

const defaultColors = ["#e8453c"];

class MainPaletteTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      :host {
        --palette-width: 12;
      }

      #main {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.25rem;
        box-sizing: border-box;
        height: 100%;
      }

      #options {
        display: flex;
        justify-content: space-between;
        height: 22px;
      }

      #palette-select, #columns {
        background-color: #232428;
        border: none;
        border-radius: 0.25rem;
        color: white;
      }

      #palette-label {
        color: white;
        font-size: small;
        margin-right: 0.25rem;
      }

      #palette {
        flex-grow: 1;
        height: 78px;
        overflow: auto;
      }

      #colors {
        display: grid;
        grid-template-columns: repeat(var(--palette-width), 1fr);
        gap: 0.125rem;
      }

      #columns {
        width: 2.5rem;
      }

      .color {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        aspect-ratio: 1;
        border-radius: 0.125rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px;
      }

      .color.selected::after {
        content: "";
        position: absolute;
        border: 4px solid white;
        border-radius: 9999px;
      }

      .color.selected.light::after {
        border-color: black;
      }

      .color:focus-visible {
        border: white solid 1px;
      }

      .color.light:focus-visible {
        border: black solid 1px;
      }
    `
  ]

  constructor(editor, colorPicker) {
    super({name: "Recent Colors"});

    this.editor = editor;
    this.colorPicker = colorPicker;
    this.colors = this._loadColors();

    this._setupEvents();
  }

  render() {
    const colorsDiv = document.createElement("div");
    colorsDiv.id = "colors";

    this.colors.forEach(color => {
      colorsDiv.appendChild(this._createColor(color))
    });

    return html`
      <div id="main">
        <div id="palette">
          ${colorsDiv}
        </div>
        <div id="options">
          <input
            id="columns" value="12" type="number"
            title="Palette width"
            inputmode="numeric"
            @input=${this._onColumnsInput}
            @wheel=${this._onColumnsWheel}
          >
        </div>
      </div>
    `;
  }

  addColor(color) {
    if (this.colors.includes(color)) { return; }

    const len = this.colors.unshift(color);

    if (len > 48) {
      this.colors.pop();
    }

    this.requestUpdate();
  }

  _loadColors() {
    return defaultColors;
  }

  _createColor(color) {
    const button = document.createElement("button");
    button.classList = ["color"];
    button.title = `Set color to ${color}`

    button.style.backgroundColor = color;
    button.setAttribute("color", color);

    const thisColor = new Color(color);
    const selectedColor = this.colorPicker.getColor();

    if (thisColor.rgb().string() == selectedColor.rgb().string()) {
      button.classList.add("selected");
    }

    if (thisColor.isLight()) {
      button.classList.add("light");
    }

    button.addEventListener("click", () => {
      this.colorPicker.setColor(color);
    })

    return button;
  }

  _setupEvents() {
    this.editor.addEventListener("tool-up", () => {
      if (!this.editor.currentTool.properties.providesColor) { return; }

      const color = this.editor.config.get("color");

      this.addColor(color.hex().toLowerCase())
    })

    this.addEventListener("wheel", this._onPaletteWheel.bind(this));

    this.colorPicker.addEventListener("color-change", () => {
      this.requestUpdate();
    });
  }

  _onColumnsInput(event) {
    if (event.target.value == "") { return; }

    event.target.value = clamp(Number(event.target.value), 1, 30);
    this.style.setProperty("--palette-width", event.target.value);
  }

  _onColumnsWheel(event) {
    event.preventDefault();
    let dir = 1;
    if (event.deltaY > 0) { dir = -1 }
    event.target.value = clamp(Number(event.target.value) + dir, 1, 30);
    this.style.setProperty("--palette-width", event.target.value)
  }

  _onPaletteWheel(event) {
    if (!event.ctrlKey) { return; }
    event.preventDefault();

    let dir = 1;
    if (event.deltaY < 0) { dir = -1 }

    const columns = this.shadowRoot.getElementById("columns");
    columns.value = clamp(Number(columns.value) + dir, 1, 30);
    this.style.setProperty("--palette-width", columns.value);
  }
}

customElements.define("ncrs-main-palette-tab", MainPaletteTab);

export default MainPaletteTab;