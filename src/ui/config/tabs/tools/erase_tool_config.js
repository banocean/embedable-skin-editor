import { css, html, LitElement } from "lit";

class EraseToolConfig extends LitElement {
  static styles = css`
    #main {
      color: rgb(156 163 175);
      padding: 0.5rem;
    }

    h2 {
      text-align: center;
      font-size: small;
      font-weight: normal;
      margin-top: 0px;
    }

    .group {
      display: flex;
      gap: 0.5rem;
    }

    .group-sm {
      display: flex;
      gap: 0.25rem;
    }

    .title {
      padding: 0px;
      font-size: x-small;
      margin: 0px;
    }
  `;

  static properties = {
    size: {},
    shape: {},
  }

  constructor(config) {
    super();
    this.config = config;
  }

  connectedCallback() {
    super.connectedCallback();

    this.size = this.config.get("size");
    this.shape = this.config.get("shape");
  }

  render() {
    return html`
      <div id="main">
        <h2>Eraser Tool</h2>
        <div class="group">
          <div>
            <p class="title">Size</p>
            <ncrs-option-control id="size" @select=${this._onSizeSelect} selected=${this.size}>
              <ncrs-option-control-button icon="square" name="1"></ncrs-option-control-button>
              <ncrs-option-control-button icon="foursquare" name="2"></ncrs-option-control-button>
              <ncrs-option-control-button icon="grid" name="3"></ncrs-option-control-button>
            </ncrs-option-control>
          </div>
          <div>
            <p class="title">Shape</p>
            <ncrs-option-control id="shape" @select=${this._onShapeSelect} selected=${this.shape}>
              <ncrs-option-control-button icon="square" name="square"></ncrs-option-control-button>
              <ncrs-option-control-button icon="circle" name="circle"></ncrs-option-control-button>
            </ncrs-option-control>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this._setupCallbacks();
  }

  _setupCallbacks() {
    this.config.addEventListener("size-change", (event) => {
      this.size = event.detail;
    });

    this.config.addEventListener("shape-change", (event) => {
      this.shape = event.detail;
    });
  }

  _onSizeSelect(event) {
    this.config.set("size", Number(event.detail.name));
  }

  _onShapeSelect(event) {
    this.config.set("shape", event.detail.name);
  }
}

customElements.define("ncrs-erase-tool-config", EraseToolConfig);

export default EraseToolConfig;
