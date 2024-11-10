class Layers {
  layers = [];

  getLayer(id) {
    const index = this.layers.findIndex((layer) => layer.id == id);
    if (index < 0) {
      return;
    }
    return this.layers[index];
  }

  addLayer(texture) {
    this.layers.push(new Layer(texture));
  }
}

class Layer {
  static lastLayerId = 0;

  constructor(texture) {
    this.texture = texture;
    this.id = Layer.lastLayerId++;
  }
}
