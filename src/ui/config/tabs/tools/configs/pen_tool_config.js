import { html, nothing } from "lit";
import BaseToolConfig from "./base_tool_config";

class PenToolConfig extends BaseToolConfig {
  static styles = [
    BaseToolConfig.styles
  ];

  static properties = {
    size: {},
    shape: {},
    camo: {},
    blend: {},
  }

  constructor(config) {
    super(config, {
      size: {type: "select", number: true},
      shape: {type: "select"},
      camo: {type: "toggle"},
      blend: {type: "toggle"},
    });
    this.config = config;

    this._setupCallbacks();
  }

  render() {
    return html`
      <div id="main">
        <h2>Brush Tool</h2>
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
        <div>
          <p class="title">Effects</p>
          <div class="group-sm">
            <ncrs-toggle-control id="camo" @toggle=${this._onCamoToggle} icon="checker" selected=${this.camo || nothing} title="Toggle camo\nRandomly lightens and darkens the current color"></ncrs-toggle-control>
            <ncrs-toggle-control id="blend" @toggle=${this._onBlendToggle} icon="palette" selected=${this.blend || nothing} title="Toggle blend\nRandomly selects colors from the blend palette"></ncrs-toggle-control>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ncrs-pen-tool-config", PenToolConfig);

export default PenToolConfig;
