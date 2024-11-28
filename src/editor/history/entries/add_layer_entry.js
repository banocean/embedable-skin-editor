import { BaseEntry } from "../base_entry";

class AddLayerEntry extends BaseEntry {
  constructor(layers, params = {}) {
    super();

    this.layers = layers;
    this.texture = params.texture;
    this.layer = params.layer;
  }

  onPerform() {
    this.layer = this.layer || this.layers.createFromTexture(this.texture);
    this.layers.addLayer(this.layer);
  }

  onRevert() {
    this.layers.removeLayer(this.layer);
  }
}

export default AddLayerEntry;