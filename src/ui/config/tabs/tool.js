import Tab from "../../misc/tab";
import ColorPicker from "../../misc/color_picker";
import { css, html } from "lit";

class ToolTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      ncrs-color-picker {
        width: 100%;
        height: 15rem;
        padding: 0.5rem;
        box-sizing: border-box;
      }
    `
  ]

  constructor(editor) {
    super({name: "Tools"});
    this.editor = editor;
  }

  render() {
    return html`
      <ncrs-color-picker @color-change=${this._onColorChange} @easteregg=${this._onEasterEgg}></ncrs-color-picker>
      <p>Hello, World!</p>`
  }

  _onColorChange(event) {
    const color = event.detail.color;
    this.editor.config.color = {
      r: color.red(),
      g: color.green(),
      b: color.blue(),
      a: color.alpha() * 255,
    };
  }

  _onEasterEgg(event) {
    this.editor.easterEgg(event.detail);
  }
}

customElements.define("ncrs-tool-tab", ToolTab);

export default ToolTab;