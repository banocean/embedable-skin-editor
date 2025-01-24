import Color from "color";
import { clamp } from "../../../../helpers";
import Tab from "../../../misc/tab";
import { css, html } from "lit";
import IconButton from "../../../misc/icon_button";

class BlendPaletteTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      :host {
        --palette-width: 12;
      }

      p {
        margin: 0px;
        color: #aaaaaa;
        font-size: x-small;
        padding-bottom: 0.25rem;
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

      .palette-element {
        all: unset;
        display: inline-block;
        cursor: pointer;
        aspect-ratio: 1;
        border-radius: 0.125rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px;
      }

      .color.selected {
        border: 2px solid white;
      }

      .color.selected.light {
        border: 2px solid #4F4F4F;
      }

      #plus {
        background-color: #313436;
        color: white;
        text-align: center;
        line-height: 1rem;
      }

      #remove {
        width: 20px;
        height: 20px;
        --icon-height: 12px;
      }

      #remove::part(button) {
        padding: 0.25rem;
      }
    `
  ]

  static properties = {
    selected: {},
  }

  constructor(editor, colorPicker) {
    super({name: "Blend Palette", buttonPart: "blend-palette"});

    this.editor = editor;
    this.colorPicker = colorPicker;
    this.colors = this._loadColors();

    this._setupEvents();
  }

  render() {
    const colors = this.editor.config.get("blend-palette", []);

    const plusButton = document.createElement("button");
    plusButton.id = "plus";
    plusButton.classList.add("palette-element");
    plusButton.addEventListener("click", this._onPlusClick.bind(this));
    plusButton.textContent = "+";

    if (colors.length < 1) {
      return html`
        <div id="main">
          <div id="colors">
            ${plusButton}
          </div>
          <p>Click the plus to add a color to the blend palette.</p>
          <p>Colors in this palette will be randomly sampled by tools with the blend effect on.</p>
        </div>
      `
    }

    const colorsDiv = document.createElement("div");
    colorsDiv.id = "colors";
    
    colorsDiv.appendChild(plusButton);
    colors.forEach(color => {
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
          <ncrs-icon-button id="remove" title="Remove selected color" icon="trash" @click=${this._removeSelected}></ncrs-icon-button>
        </div>
      </div>
    `;
  }

  addColor(color) {
    const colors = [...this.editor.config.get("blend-palette", [])];

    if (colors.includes(color)) { return; }

    const len = colors.unshift(color);

    if (len > 47) {
      colors.pop();
    }

    this.selected = this.selected || color;
    this.editor.config.set("blend-palette", colors);
  }

  removeColor(color) {
    const colors = [...this.editor.config.get("blend-palette", [])];

    if (!colors.includes(color)) { return; }

    const index = colors.indexOf(color);
    const lastIndex = colors.length - 1;

    let nextIndex = index;
    if (index == lastIndex) {
      nextIndex -= 1;
    } else {
      nextIndex += 1;
    }

    const nextColor = colors[nextIndex];
    colors.splice(index, 1);

    this.editor.config.set("blend-palette", colors);
    this.selected = nextColor;
    this.colors = color;
  }

  _removeSelected() {
    this.removeColor(this.selected);
  }

  _loadColors() {
    return this.editor.config.get("blend-palette", []);
  }

  _createColor(color) {
    const button = document.createElement("button");
    button.classList.add("color", "palette-element");
    if (color === this.selected) {
      button.classList.add("selected")
    }
    if (new Color(color).isLight()) {
      button.classList.add("light");
    }

    button.title = `Set color to ${color}`

    button.style.backgroundColor = color;
    button.setAttribute("color", color);

    button.addEventListener("click", () => {
      this.colorPicker.setColor(color);
      this.selected = color;
    })

    return button;
  }

  _onPlusClick() {
    this.addColor(this.colorPicker.getColor().hex());
  }

  _setupEvents() {
    this.editor.config.addEventListener("blend-palette-change", () => {
      this.requestUpdate();
    })

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

customElements.define("ncrs-blend-palette-tab", BlendPaletteTab);

export default BlendPaletteTab;