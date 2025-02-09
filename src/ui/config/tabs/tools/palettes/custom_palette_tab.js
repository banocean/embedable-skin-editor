import { clamp } from "three/src/math/MathUtils.js";
import { objectToColor } from "../../../../../helpers";
import Tab from "../../../../misc/tab";
import { css, html } from "lit";
import Color from "color";

const defaultPalettes = [
  {
    name: "Basic",
    palette: [
      "#ffffff", "#000000", "#c0c0c0", "#808080", "#ff0000", "#ffff00", "#808000", "#00ff00",
      "#008000", "#00ffff", "#008080", "#0000ff", "#000080", "#ff00ff", "#800080"
    ]
  },
  {
    name: "Pastels",
    palette: [
      "#e29191", "#99dd92", "#92d8b9", "#94c4d3", "#949ace", "#b394cc", "#cc96b1", "#cca499",
      "#dfe592", "#ffa560", "#6aff63", "#64ffcc", "#64c4ff", "#646bff", "#ad65ff", "#ff65f4",
      "#ff6584", "#ff6565"
    ]
  }
]

class CustomPaletteTab extends Tab {
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
        display: inline-block;
        cursor: pointer;
        aspect-ratio: 1;
        border-radius: 0.125rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px;
      }

      .color:focus {
        border: white solid 1px;
      }

      .color.light:focus {
        border: #4F4F4F solid 1px;
      }
    `
  ]

  constructor(colorPicker) {
    super({name: "Palette"});

    this.colorPicker = colorPicker;
    this.palettes = this._loadPalettes();
    this.colors = this.palettes[0].palette;

    this.select = this._createSelect();
    this.select.id = "palette-select";

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
          <div>
            <label id="palette-label" for="palette-select">Select palette</label>
            ${this.select}
          </div>
        </div>
      </div>
    `;
  }

  _loadPalettes() {
    return defaultPalettes;
  }

  _createSelect() {
    const select = document.createElement("select");

    let idx = 0;
    this.palettes.forEach(palette => {
      const option = document.createElement("option");
      option.value = idx;
      option.textContent = palette.name;

      select.appendChild(option);

      idx++;
    });

    select.addEventListener("input", () => {
      this.colors = this.palettes[select.value].palette;
      this.requestUpdate();
    });

    return select;
  }

  _createColor(color) {
    const button = document.createElement("button");
    button.classList = ["color"];
    button.title = `Set color to ${color}`

    button.style.backgroundColor = color;
    button.setAttribute("color", color);

    if (new Color(color).isLight()) {
      button.classList.add("light");
    }

    button.addEventListener("click", () => {
      this.colorPicker.setColor(color);
    })

    return button;
  }

  _setupEvents() {
    this.addEventListener("wheel", this._onPaletteWheel.bind(this));
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

customElements.define("ncrs-custom-palette-tab", CustomPaletteTab);

export default CustomPaletteTab;