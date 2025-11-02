import { css, html, LitElement } from "lit";
import * as THREE from "three";
import UpdateLayerTextureEntry from "../../../../editor/history/entries/update_layer_texture_entry";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../../../../constants";

class LayersTabButtons extends LitElement {
  static styles = css`
    #layer-buttons {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap:0.5rem;
      flex-basis: 0;
      padding: 0.5rem;
      padding-top:0.75rem;
    }

    #layer-buttons ncrs-icon-button {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      width:calc(50% - 0.25rem);
    }

    #layer-buttons ncrs-icon-button::part(icon) {
      height: 2.6rem;
    }

    #layer-buttons label {
      font-size: small;
      color: #86898b;
      width:calc(50% - 0.25rem);
      text-align: center;
      margin-top: -0.5rem;
      margin-bottom: -0.375rem;
    }

  `;

  constructor(editor) {
    super();

    this.editor = editor;
    this.config = editor.toolConfig;
  }

  render() {
    return html`
      <ncrs-layers-tab-filters></ncrs-layers-tab-filters>
      <div id="layer-buttons">
      <label>Flip Front / Back</label>
      <label>Flip Left / Right</label>
      <ncrs-icon-button icon="flip-front-back" @click=${this.swapFrontBack} title="Flip the skin's front with its back."></ncrs-icon-button>
      <ncrs-icon-button icon="flip-left-right" @click=${this.swapLeftRight} title="Flip the current skin horizontally."></ncrs-icon-button>
      <label>Swap Body / Overlay</label>
      <label>Flatten Overlay</label>
      <ncrs-icon-button icon="swap-body-overlay" @click=${this.swapBodyOverlay} title="Swap the body layer of the skin with its overlay."></ncrs-icon-button>
      <ncrs-icon-button icon="flatten-overlay-base" @click=${this.flattenLayerOverlay} title="Flatten the overlay in to the base of the skin on the selected layer."></ncrs-icon-button>
      <label>Erase Base</label>
      <label>Erase Overlay</label>
      <ncrs-icon-button icon="erase-base" @click=${this.clearLayerBase} title="Erases the base of the skin on the selected layer."></ncrs-icon-button>
      <ncrs-icon-button icon="erase-overlay" @click=${this.clearLayerOverlay} title="Erases the overlay of the skin on the selected layer."></ncrs-icon-button>
      </div>
      `;
  }

  swapBodyOverlay() {
    const layers = this.editor.layers;
    const layer = this._getLayer();
    const canvas = layer.swapBodyOverlayTexture("classic");
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

    this.editor.history.add(
      new UpdateLayerTextureEntry(layers, layer, texture)
    );
  }

  swapFrontBack() {
    const layers = this.editor.layers;
    const layer = this._getLayer();
    const canvas = layer.swapFrontBackTexture(this.editor.config.get("variant", "classic"));
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

    this.editor.history.add(
      new UpdateLayerTextureEntry(layers, layer, texture)
    );
  }

  swapLeftRight() {
    const layers = this.editor.layers;
    const layer = this._getLayer();
    const canvas = layer.swapLeftRightTexture(this.editor.config.get("variant", "classic"));
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

    this.editor.history.add(
      new UpdateLayerTextureEntry(layers, layer, texture)
    );
  }

  clearLayerBase() {
    const layers = this.editor.layers;
    const layer = this._getLayer();
    const canvas = layer.clearBase(this.editor.config.get("variant", "classic"));
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

    this.editor.history.add(
      new UpdateLayerTextureEntry(layers, layer, texture)
    );
  }

  clearLayerOverlay() {
    const layers = this.editor.layers;
    const layer = this._getLayer();
    const canvas = layer.clearOverlay(this.editor.config.get("variant", "classic"));
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

    this.editor.history.add(
      new UpdateLayerTextureEntry(layers, layer, texture)
    );
  }

  flattenLayerOverlay() {
    const layers = this.editor.layers;
    const layer = this._getLayer();
    const canvas = layer.flattenOverlay(this.editor.config.get("variant", "classic"));
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

    this.editor.history.add(
      new UpdateLayerTextureEntry(layers, layer, texture)
    );
  }

  _getLayer() {
    return this.editor.layers.getSelectedLayer();
  }
}

customElements.define("ncrs-layers-tab-buttons", LayersTabButtons);

export default LayersTabButtons;