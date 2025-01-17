import Tab from "../../misc/tab";
import "../../misc/color_picker";
import { css, html } from "lit";
import PenToolConfig from "./tools/pen_tool_config";
import TabGroup from "../../misc/tab_group";
import { colorToObject } from "../../../helpers";
import MainPaletteTab from "./tools/main_palette_tab";
import ColorPicker from "../../misc/color_picker";
import CustomPaletteTab from "./tools/custom_palette";
import BlendPaletteTab from "./tools/blend_palette";

class ToolTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      ncrs-color-picker {
        width: 100%;
        height: 15rem;
        box-sizing: border-box;
        margin-bottom: 0.5rem;
      }

      #main {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      #colors {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        flex-basis: 0;
        background-color: #1A1A1A;
        padding: 0.5rem;
      }

      #palettes {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      #palettes::part(buttons) {
        display: flex;
        gap: 0.25rem;
      }

      #palettes::part(button) {
        all: unset;
        flex-grow: 1;
        display: block;
        cursor: pointer;
        text-align: center;
        color: white;
        font-size: small;
        user-select: none;
        padding: 0.25rem;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        border-width: 0px;
        border-top-width: 2px;
        border-color: #232428;
        border-style: solid;
        background-color: #232428;
      }

      #palettes::part(button):hover {
        color: #f5f8cc;
      }

      #palettes::part(button selected),
      #palettes::part(button):active {
        border-color: #313436;
      }

      #palettes::part(button selected) {
        background-color: #131315;
      }

      #palettes::part(tabs) {
        flex-grow: 1;
      }

      #palettes::part(tab) {
        height: 100%;
        background-color: #131315;
      }

      #config {
        max-height: 200px;
        flex-grow: 1;
        flex-basis: 0;
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
    this.colorPicker = this._setupColorPicker();

    this._setupToolConfigs();
  }
  toolConfigs;

  render() {
    const palette = this._createPaletteTabs();
    const config = this.toolConfigs[this.tool];
    config.id = "config";

    return html`
      <div id="main">
        <div id="colors">
          ${this.colorPicker}
          ${palette}
        </div>
        ${config}
      </div>
    `
  }

  _createPaletteTabs() {
    const tabGroup = new TabGroup();
    tabGroup.id = "palettes";
    tabGroup.side = "top";

    tabGroup.registerTab(new MainPaletteTab(this.editor, this.colorPicker));
    tabGroup.registerTab(new CustomPaletteTab(this.colorPicker));
    tabGroup.registerTab(new BlendPaletteTab(this.editor, this.colorPicker));

    return tabGroup;
  }

  _setupToolConfigs() {
    const config = this.editor.config;

    this.toolConfigs = {
      pen: new PenToolConfig(config),
    }
  }

  _setupColorPicker() {
    const colorPicker = new ColorPicker();

    colorPicker.addEventListener("color-change", this._onColorChange.bind(this));
    colorPicker.addEventListener("easteregg", this._onEasterEgg.bind(this));

    return colorPicker;
  }

  _onColorChange(event) {
    const color = event.detail.color;
    this.editor.config.set("color", colorToObject(color));
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