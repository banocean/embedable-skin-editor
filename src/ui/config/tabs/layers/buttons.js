import { css, html, LitElement } from "lit";
import * as THREE from "three";
import UpdateLayerTextureEntry from "../../../../editor/history/entries/update_layer_texture_entry";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../../../../constants";

class LayersTabButtons extends LitElement {
  static styles = css`
    #layer-buttons {
      display: flex;
      flex-direction: column;
      flex-basis: 0;
      padding: 0.5rem;
    }

    #layer-buttons ncrs-button {
      text-align: center;
      font-size: large;
      font-weight: bold;
    }

    #layer-buttons ncrs-button::part(button) {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    hr {
      width: 100%;
      border-color: rgb(73, 76, 78);
      margin-bottom: 0.75rem;
      box-sizing: border-box;
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
        <ncrs-button @click=${this.swapBodyOverlay} title="Swap body of the skin with the overlay.">Swap Body / Overlay</ncrs-button>
        <ncrs-button @click=${this.swapLeftRight} title="Flip skin left and right.">Flip Left / Right</ncrs-button>
        <ncrs-button @click=${this.swapFrontBack} title="Flip skin front and back.">Flip Front / Back</ncrs-button>
        <hr>
        <ncrs-button @click=${this.flattenLayerOverlay} title="Flatten the overlay in to the base of the skin on the selected layer.">Flatten Overlay in to Base</ncrs-button>
        <ncrs-button @click=${this.clearLayerBase} title="Erases the base of the skin on the selected layer.">Erase Skin Base</ncrs-button>
        <ncrs-button @click=${this.clearLayerOverlay} title="Erases the overlay of the skin on the selected layer.">Erase Skin Overlay</ncrs-button>
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