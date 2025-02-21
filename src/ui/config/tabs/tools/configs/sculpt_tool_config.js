import { html } from "lit";
import BaseToolConfig from "./base_tool_config";

class SculptToolConfig extends BaseToolConfig {
  static styles = [
    BaseToolConfig.styles
  ];

  static properties = {
    size: {},
    shape: {},
  }

  constructor(config) {
    super(config, {
      size: {
        type: "select", number: true,
        options: [{icon: "square", value: 1}, {icon: "foursquare", value: 2}, {icon: "grid", value: 3}]
      },
      shape: {
        type: "select",
        options: [{icon: "square", value: "square"}, {icon: "circle", value: "circle"}]
      },
    });
  }

  render() {
    return html`
      <div id="main">
        <h2>Sculpt Tool</h2>
        <div class="group">
          <div>
            <p class="title">Size</p>
            ${this._sizeControl()}
          </div>
          <div>
            <p class="title">Shape</p>
            ${this._shapeControl()}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ncrs-sculpt-tool-config", SculptToolConfig);

export default SculptToolConfig;
