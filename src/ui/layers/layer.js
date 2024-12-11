import { css, html, LitElement } from "lit";
import NCRSEditor from "../../main";

class Layer extends LitElement {
  static styles = css`
    :host {
      width: 64px;
      height: 48px;
      image-rendering: pixelated;
      border-style: dashed;
      border-width: 2px;
      border-color: #2e3437;
    }

    :host([active=true]) {
      border-color: #5a6472;
    }

    #layer {
      position: relative;
      width: 100%;
      height: 100%;
    }

    button {
      all: unset;
      position: absolute;
      display: flex;
      justify-content: center;

      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }

    #visibility-toggle {
      position: absolute;
      width: 16px;
      height: 16px;
      left: 2px;
      top: 16px;
    }

    ncrs-icon {
      --icon-color: white;
      width: 16px;
      height: auto;
    }
  `

  static properties = {
    active: {reflect: true},
    visible: {},
  }

  constructor(layer) {
    super();

    this.layer = layer;
    this.visible = layer.visible;

    if (this.layer == undefined) { return; }

    this.canvas = this._setupCanvas();
    this.active = layer.selected;

    this.layer.addEventListener("layer-update", () => {
      this.requestUpdate();
    })

    this.layer.addEventListener("layer-select", event => {
      this.active = event.detail.selected;
    })
  }

  render() {
    const image = this.layer.toPreview();
    const ctx = this.canvas.getContext("2d");

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(image, 0, 0);

    return html`
      <div id="layer">
        <button @click=${this.select}>${this.canvas}</button>
        <button id="visibility-toggle" @click=${this.toggleVisibile}>
          <ncrs-icon icon="${this.visible ? "eye-open" : "eye-closed"}" color="var(--icon-color)">
          </ncrs-icon>
        </button>
      </div>
    `;
  }

  select() {
    NCRSEditor.selectLayer(this.layer);
    this.active = true;
  }

  toggleVisibile() {
    this.visible = !this.visible;
    this.layer.visible = this.visible;

    NCRSEditor.renderLayers();
  }

  _setupCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "preview";
    canvas.width = 36;
    canvas.height = 32;

    return canvas;
  }
}

customElements.define("ncrs-layer", Layer);

export default Layer;