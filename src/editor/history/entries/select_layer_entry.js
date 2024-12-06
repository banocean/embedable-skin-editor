import { BaseEntry } from "../base_entry";

class SelectLayerEntry extends BaseEntry {
  constructor(layers, layer) {
    super();

    this.layers = layers;
    this.layer = layer;
    this.oldLayerIndex = layers.selectedLayerIndex;
  }

  onPerform() {
    const index = this.layers.layerIndex(this.layer);
    this.layers.selectLayer(index);
  }

  onRevert() {
    this.layers.selectLayer(this.oldLayerIndex);
  }
}

export default SelectLayerEntry;