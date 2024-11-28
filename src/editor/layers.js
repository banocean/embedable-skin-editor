import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils.js";

class Layers {
  constructor(width, height) {
    this.canvas = new OffscreenCanvas(width, height);
    this.texture = this._setupTexture();
  }
  lastLayerId = 0;
  selectedLayerIndex = 0;
  layers = [];

  getLayer(id) {
    const index = this.layers.findIndex((layer) => layer.id == id);
    if (index < 0) {
      return;
    }
    return this.layers[index];
  }

  getSelectedLayer() {
    this.selectedLayerIndex = clamp(
      this.selectedLayerIndex,
      0,
      this.layers.length - 1
    );
    return this.layers[this.selectedLayerIndex];
  }

  createFromTexture(texture) {
    return new Layer(this.lastLayerId++, texture);
  }

  layerIndex(layer) {
    return this.layers.findIndex((element) => {
      return layer.id == element.id;
    });
  }

  addLayer(layer) {
    this.layers.push(layer);
    this.renderTexture();
  }

  removeLayer(layer) {
    const index = this.layerIndex(layer);

    if (index < 0) { return false; }

    this.layers.splice(index, 1)[0];
    this.renderTexture();
  }

  reorderLayers(fromIndex, toIndex) {
    const max = this.layers.length - 1;
    if (fromIndex < 0 || fromIndex > max || toIndex < 0 || toIndex > max) { return false; }

    this.layers.splice(toIndex, 0, this.layers.splice(fromIndex, 1)[0])
  }

  renderTexture() {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.forEach((layer) => {
      ctx.drawImage(layer.texture.image, 0, 0);
    });

    this.texture.needsUpdate = true;
  }

  _setupTexture() {
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
  }
}

class Layer {
  constructor(id, texture) {
    this.id = id;
    this.texture = texture;
    this.oldTexture = texture;
  }

  flush() {
    this.oldTexture = this.texture;
  }

  replaceTexture(texture) {
    this.texture = texture;
  }
}

export { Layers, Layer };
