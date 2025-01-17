import { clamp, objectToColor } from "../../../../helpers";
import Tab from "../../../misc/tab";
import { css, html } from "lit";

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
        font-size: small;
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

      #plus {
        background-color: #313436;
        color: white;
        text-align: center;
      }
    `
  ]

  constructor(editor, colorPicker) {
    super({name: "Blend Palette"});

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

    colors.forEach(color => {
      colorsDiv.appendChild(this._createColor(color))
    });

    colorsDiv.appendChild(plusButton);

    return html`
      <div id="main">
        <div id="palette">
          ${colorsDiv}
        </div>
        <div id="options">
          <input
            id="columns" value="12" type="number"
            title="Palette width"
            @input=${this._onColumnsInput}
            @wheel=${this._onColumnsWheel}
          >
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

    this.editor.config.set("blend-palette", colors);
  }

  _loadColors() {
    return this.editor.config.get("blend-palette", []);
  }

  _createColor(color) {
    const button = document.createElement("button");
    button.classList.add("color", "palette-element");
    button.title = `Set color to ${color}`

    button.style.backgroundColor = color;
    button.setAttribute("color", color);

    button.addEventListener("click", () => {
      this.colorPicker.setColor(color);
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
  }

  _onColumnsInput(event) {
    if (event.target.value == "") { return; }

    event.target.value = clamp(Number(event.target.value), 1, 30);
    this.style.setProperty("--palette-width", event.target.value);
  }

  _onColumnsWheel(event) {
    let dir = 1;
    if (event.deltaY > 0) { dir = -1 }
    event.target.value = clamp(Number(event.target.value) + dir, 1, 30);
    this.style.setProperty("--palette-width", event.target.value)
  }
}

customElements.define("ncrs-blend-palette-tab", BlendPaletteTab);

export default BlendPaletteTab;