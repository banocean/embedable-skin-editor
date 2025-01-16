import { objectToColor } from "../../../../helpers";
import Tab from "../../../misc/tab";
import { css, html } from "lit";

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
      "#E29191", "#99DD92", "#92D8B9", "#94C4D3", "#949ACE", "#B394CC", "#CC96B1", "#CCA499",
      "#DFE592", "#FFA560", "#6AFF63", "#64FFCC", "#64C4FF", "#646BFF", "#AD65FF", "#FF65F4",
      "#FF6584", "#FF6565"
    ]
  }
]

class CustomPaletteTab extends Tab {
  static styles = [
    Tab.styles,
    css`
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
        justify-content: flex-end;
      }

      #palette-select {
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
      }

      #colors {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.125rem;
      }

      .color {
        all: unset;
        display: inline-block;
        cursor: pointer;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 0.125rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px;
      }
    `
  ]

  constructor(colorPicker) {
    super({name: "Palette"});

    this.colorPicker = colorPicker;
    this.palettes = this._loadPalettes();
    this.colors = this.palettes[0].palette;

    this.select = this._createSelect();
    this.select.id = "palette-select"

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
          <label id="palette-label" for="palette-select">Select palette</label>
          ${this.select}
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
      console.log(select.value);
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

    button.addEventListener("click", () => {
      this.colorPicker.setColor(color);
    })

    return button;
  }

  _setupEvents() {}
}

customElements.define("ncrs-custom-palette-tab", CustomPaletteTab);

export default CustomPaletteTab;