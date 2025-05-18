import { html, nothing } from "lit";
import BaseToolConfig from "./base_tool_config";

class BucketToolConfig extends BaseToolConfig {
  static styles = [
    BaseToolConfig.styles
  ];

  static properties = {
    contiguous: {},
    camo: {},
    blend: {},
  }

  constructor(config) {
    super(config, {
      contiguous: {
        type: "toggle", icon: "contiguous", 
        title: "Toggle contiguous\nIf disabled, will replace all pixels in the same color, on the whole canvas ignoring boundaries"
      },
      camo: {type: "toggle", icon: "camo", title: "Toggle camo\nRandomly lightens and darkens the current color"},
      blend: {type: "toggle", icon: "blend", title: "Toggle blend\nRandomly selects colors from the blend palette"},
    });
  }

  render() {
    return html`
    <div id="main">
        <h2>Bucket Tool</h2>
        <div class="group">
          <div>
            <p class="title">Effects</p>
            <div class="group-sm">
              ${this._contiguousControl()}
              ${this._camoControl()}
              ${this._blendControl()}
            </div>
          </div>
        </div>
    </div>
    `;
  }
}

customElements.define("ncrs-bucket-tool-config", BucketToolConfig);

export default BucketToolConfig;
