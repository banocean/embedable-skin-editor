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
      contiguous: {
        type: "toggle", icon: "square",
        title: "Toggle contiguous\nIf disabled, will replace all pixels in the same color, on the whole canvas ignoring boundaries"
      },
    });
  }

  render() {
    return html`
    <div id="main">
        <h2>Bucket Tool</h2>
        <div class="group">
          ${this._contiguousControl()}
        </div>
    </div>
    `;
  }
}

customElements.define("ncrs-bucket-tool-config", BucketToolConfig);

export default BucketToolConfig;
