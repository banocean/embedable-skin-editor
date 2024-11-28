import { BaseEntry } from "../base_entry";

class DeleteLayerEntry extends BaseEntry {
  constructor(layers, layer) {
    super();
    
    this.layers = layers;
    this.layer = layer;
  }

  onPerform() {
    this.layers.removeLayer(this.layer);
  }

  onRevert() {
    this.layers.addLayer(this.layer);
  }
}

export default DeleteLayerEntry;