import { html } from "lit";
import BaseToolConfig from "./base_tool_config";

class ShadeToolConfig extends BaseToolConfig {
  static styles = [
    BaseToolConfig.styles
  ];

  static properties = {
    size: {},
    shape: {},
  }

  constructor(config) {
    super(config, {
      size: {type: "select", number: true},
      shape: {type: "select"},
    });
    this.config = config;

    this._setupCallbacks();
  }

  render() {
    return html`
      <div id="main">
        <h2>Shade Tool</h2>
        <div class="group">
          <div>
            <p class="title">Size</p>
            <ncrs-option-control id="size" @select=${this._onSizeSelect} selected=${this.size}>
              <ncrs-option-control-button icon="square" name="1" title="Set size to 1">
              </ncrs-option-control-button>
              <ncrs-option-control-button icon="foursquare" name="2" title="Set size to 2">
              </ncrs-option-control-button>
              <ncrs-option-control-button icon="grid" name="3" title="Set size to 3">
              </ncrs-option-control-button>
            </ncrs-option-control>
          </div>
          <div>
            <p class="title">Shape</p>
            <ncrs-option-control id="shape" @select=${this._onShapeSelect} selected=${this.shape}>
              <ncrs-option-control-button icon="square" name="square" title="Set shape to square">
              </ncrs-option-control-button>
              <ncrs-option-control-button icon="circle" name="circle" title="Set shape to circle">
              </ncrs-option-control-button>
            </ncrs-option-control>
          </div>
      </div>
    `;
  }
}

customElements.define("ncrs-shade-tool-config", ShadeToolConfig);

export default ShadeToolConfig;
