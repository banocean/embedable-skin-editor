import { BaseEntry } from "../base_entry";

class UpdateLayerTexture extends BaseEntry {
  constructor(layers, layer, texture) {
    super();

    this.layers = layers;
    this.layer = layer;
    this.texture = texture;
  }

  oldTexture;

  onPerform() {
    this.oldTexture = this.layer.texture;
    this.layer.replaceTexture(this.texture);
    this.layers.renderTexture();
  }

  onRevert() {
    this.layer.replaceTexture(this.oldTexture);
    this.layers.renderTexture();
  }
}

export default UpdateLayerTexture;