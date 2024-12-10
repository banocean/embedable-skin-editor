import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils.js";
import { imageToPreview } from "./layer_preview";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./main";

class Layers extends EventTarget {
  constructor(width, height) {
    super();

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

  getLayerAtIndex(index) {
    if (index < 0 || index > this.layers.length - 1) { return false }

    return this.layers[index];
  }

  getSelectedLayerIndex() {
    return this.selectedLayerIndex = clamp(
      this.selectedLayerIndex,
      0,
      this.layers.length - 1
    );
  }

  getSelectedLayer() {
    return this.layers[this.getSelectedLayerIndex()];
  }

  createFromTexture(texture) {
    return new Layer(this.lastLayerId++, texture);
  }

  createBlank() {
    const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);

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
    this.dispatchEvent(new CustomEvent("layers-update"));
  }

  addBlankLayer() {
    this.addLayer(this.createBlank());
  }

  insertLayer(layer, index) {
    if (index < 0 || index > this.layers.length - 1) { return false }

    this.layers.splice(index, 0, layer);
    this.renderTexture();
    this.dispatchEvent(new CustomEvent("layers-update"));
  }

  removeLayer(layer) {
    const index = this.layerIndex(layer);

    if (index < 0) { return false; }

    this.layers.splice(index, 1);

    this.renderTexture();
    this.dispatchEvent(new CustomEvent("layers-update"));
  }

  selectLayer(index) {
    if (index < 0 || index > this.layers.length - 1) { return false }

    this.selectedLayerIndex = index;

    this.layers.forEach((layer, idx) => {
      layer.select(this.selectedLayerIndex == idx);
    })
  }

  reorderLayers(fromIndex, toIndex) {
    const max = this.layers.length - 1;
    if (fromIndex < 0 || fromIndex > max || toIndex < 0 || toIndex > max) { return false; }

    const currentLayer = this.getSelectedLayer();
    this.layers.splice(toIndex, 0, this.layers.splice(fromIndex, 1)[0]);

    const idx = this.layerIndex(currentLayer);
    this.selectLayer(idx);

    this.renderTexture();
    this.dispatchEvent(new CustomEvent("layers-update"));
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

class Layer extends EventTarget {
  constructor(id, texture) {
    super();

    this.id = id;
    this.texture = texture;
    this.oldTexture = texture;
  }
  selected = false;

  flush() {
    this.oldTexture = this.texture;
  }

  replaceTexture(texture) {
    this.texture = texture;
    this.dispatchEvent(new CustomEvent("layer-update"));
  }

  select(selected) {
    this.selected = selected;
    this.dispatchEvent(new CustomEvent("layer-select", {detail: {selected}}));
  }

  toPreview() {
    return imageToPreview(this.texture.image);
  }
}

export { Layers, Layer };
