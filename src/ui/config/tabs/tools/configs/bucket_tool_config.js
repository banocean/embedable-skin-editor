import { html, nothing } from "lit";
import BaseToolConfig from "./base_tool_config";
import BucketTool from "../../../../../editor/tools/toolset/bucket_tool";

class BucketToolConfig extends BaseToolConfig {
  static styles = [
    BaseToolConfig.styles
  ];

  static properties = {
    replaceColor: {},
    camo: {},
    blend: {},
  }

  constructor(config, mobile = false) {
    super(config, {
      replaceColor: {
        type: "toggle", icon: "replace-color", 
        title: "Toggle Replace Color\nIf enabled, will replace all pixels of the same color, on the whole canvas ignoring boundaries"
      },
      camo: {type: "toggle", icon: "camo", title: "Toggle camo\nRandomly lightens and darkens the current color"},
      blend: {type: "toggle", icon: "blend", title: "Toggle blend\nRandomly selects colors from the blend palette"},
    }, mobile);
    this.tool = new BucketTool(config);
  }

  renderDesktop() {
    return html`
      <div id="main">
        <h2>Bucket Tool</h2>
        <div class="group">
          <div>
            <p class="title">Effects</p>
            <div class="group-sm">
              ${this._replaceColorControl()}
              ${this._camoControl()}
              ${this._blendControl()}
            </div>
          </div>
        </div>
        <p class="description">${this.tool.properties.description}</p>
      </div>
    `;
  }

  renderMobile() {
    return html`
      <div id="main-mobile" class="group">
        <div>
          <p class="title">Effects</p>
          <div class="group-sm">
            ${this._replaceColorControl()}
            ${this._camoControl()}
            ${this._blendControl()}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ncrs-bucket-tool-config", BucketToolConfig);

export default BucketToolConfig;
