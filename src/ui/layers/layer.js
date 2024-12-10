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
      border-color: #aaaaaa;
    }

    :host([active=true]) {
      border-color: white;
    }

    button {
      all: unset;
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  `

  static properties = {
    active: {reflect: true},
  }

  constructor(layer) {
    super();

    this.layer = layer;

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
      <button @click=${this.select}>${this.canvas}</button>
    `;
  }

  select() {
    NCRSEditor.selectLayer(this.layer);
    this.active = true;
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