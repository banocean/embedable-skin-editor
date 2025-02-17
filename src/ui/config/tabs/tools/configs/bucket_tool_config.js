import { html, nothing } from "lit";
import BaseToolConfig from "./base_tool_config";

class BucketToolConfig extends BaseToolConfig {
  static styles = [
    BaseToolConfig.styles
  ];

  static properties = {
    contiguous: {},
  }

  constructor(config) {
    super(config, {
      contiguous: {type: "toggle"},
    });
    this.config = config;

    this._setupCallbacks();
  }

  render() {
    return html`
    <div id="main">
        <h2>Brush Tool</h2>
        <ncrs-toggle-control id="contiguous" @toggle=${this._onContiguousToggle} icon="square" selected=${this.contiguous || nothing} title="Toggle contiguous\nIf disabled, will replace all pixels in the same color, on the whole canvas ignoring boundaries"></ncrs-toggle-control>
    </div>
    `;
  }
}

customElements.define("ncrs-bucket-tool-config", BucketToolConfig);

export default BucketToolConfig;
