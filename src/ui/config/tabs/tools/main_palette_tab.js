import { objectToColor } from "../../../../helpers";
import Tab from "../../../misc/tab";
import { css } from "lit";

const defaultColors = [
  "#ffffff", "#000000", "#c0c0c0", "#808080", "#ff0000", "#ffff00", "#808000", "#00ff00",
  "#008000", "#00ffff", "#008080", "#0000ff", "#000080", "#ff00ff", "#800080"
]

class MainPaletteTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      #main {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.125rem;
        padding: 0.25rem;
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

  constructor(editor, colorPicker) {
    super({name: "Recent Colors"});

    this.editor = editor;
    this.colorPicker = colorPicker;
    this.colors = this._loadColors();

    this._setupEvents();
  }

  render() {
    const div = document.createElement("div");
    div.id = "main";

    this.colors.forEach(color => {
      div.appendChild(this._createColor(color))
    });

    return div;
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

    button.addEventListener("click", () => {
      this.colorPicker.setColor(color);
    })

    return button;
  }

  _setupEvents() {
    this.editor.addEventListener("tool-up", () => {
      const color = objectToColor(this.editor.config.get("color"));

      this.addColor(color.hex().toLowerCase())
    })
  }
}

customElements.define("ncrs-main-palette-tab", MainPaletteTab);

export default MainPaletteTab;