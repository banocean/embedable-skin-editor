import Tab from "../../misc/tab";
import "../../misc/color_picker";
import { css, html } from "lit";
import PenToolConfig from "./tools/pen_tool_config";

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

  static properties = {
    tool: {}
  }

  constructor(editor) {
    super({name: "Tools"});
    this.editor = editor;

    editor.addEventListener("select-tool", event => {
      const tool = event.detail.tool;
      this.tool = tool.properties.id;
    })

    this.tool = editor.currentTool.properties.id;

    this._setupToolConfigs();
  }
  toolConfigs;

  render() {
    const config = this.toolConfigs[this.tool];

    return html`
      <ncrs-color-picker @color-change=${this._onColorChange} @easteregg=${this._onEasterEgg}></ncrs-color-picker>
      <p>Hello, World!</p>
      ${config}
    `
  }

  _setupToolConfigs() {
    const config = this.editor.config;

    this.toolConfigs = {
      pen: new PenToolConfig(config),
    }
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

  _onSelect(event) {
    console.log(event);
  }
}

customElements.define("ncrs-tool-tab", ToolTab);

export default ToolTab;