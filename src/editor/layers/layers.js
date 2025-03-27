import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils.js";
import { imageToPreview } from "./layer_preview";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../main";
import Compositor from "./compositor";
import { swapBodyOverlay, swapFrontBack } from "./texture_utils";

class Layers extends EventTarget {
  constructor(width, height) {
    super();

    this.canvas = new OffscreenCanvas(width, height);
    this.texture = this._setupTexture();

    const scope = this;
    this.filtersUpdateCallback = function () {
      scope.renderTexture();
      scope.dispatchEvent(new CustomEvent("update-filters"));
    }
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

  createFromLayer(layer) {
    const newLayer = this.createFromTexture(layer.texture.clone());
    newLayer.compositor.applyFilters(layer.compositor.getFilters());

    return newLayer;
  }

  createFromCanvas(canvas) {
    const texture = new THREE.Texture(canvas, IMAGE_WIDTH, IMAGE_HEIGHT);
    return this.createFromTexture(texture);
  }

  deserializeLayer(serializedLayer) {
    const data = atob(serializedLayer.data);
    const array = Uint8ClampedArray.from([...data].map(ch => ch.charCodeAt()));
    const imgData = new ImageData(array, IMAGE_WIDTH, IMAGE_HEIGHT);
    const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);

    const layer = this.createFromCanvas(canvas);
    layer.compositor.deserializeFilters(serializedLayer.filters);
    layer.selected = serializedLayer.selected;

    return layer;
  }

  serializeLayers() {
    const output = [];
    this.layers.forEach(layer => output.push(layer.serialize()));
    return output;
  }

  layerIndex(layer) {
    return this.layers.findIndex((element) => {
      return layer.id == element.id;
    });
  }

  addLayer(layer) {
    this.layers.push(layer);
    layer.compositor.addEventListener("update-filters", this.filtersUpdateCallback);

    if (layer.selected) {
      this.selectLayer(this.layerIndex(layer));
    }

    this.renderTexture();
    this._sendUpdateEvent();
  }

  addBlankLayer() {
    this.addLayer(this.createBlank());
  }

  insertLayer(layer, index) {
    if (index < 0) { return false; }
    if (index > this.layers.length - 1) {
      this.layers.push(layer);
    } else {
      this.layers.splice(index, 0, layer);
    }

    layer.compositor.addEventListener("update-filters", this.filtersUpdateCallback);

    this.renderTexture();
    this._sendUpdateEvent();
  }

  removeLayer(layer) {
    const index = this.layerIndex(layer);

    if (index < 0) { return false; }
    layer.compositor.removeEventListener("update-filters", this.filtersUpdateCallback);

    this.layers.splice(index, 1);

    this.renderTexture();
    this._sendUpdateEvent();
  }

  selectLayer(index) {
    if (index < 0 || index > this.layers.length - 1) { return false }

    this.selectedLayerIndex = index;

    this.layers.forEach((layer, idx) => {
      layer.select(this.selectedLayerIndex == idx);
    })

    this.dispatchEvent(new CustomEvent("layers-select", {detail: {layer: index}}));
  }

  reorderLayers(fromIndex, toIndex) {
    const max = this.layers.length - 1;
    if (fromIndex < 0 || fromIndex > max || toIndex < 0 || toIndex > max) { return false; }

    const currentLayer = this.getSelectedLayer();
    this.layers.splice(toIndex, 0, this.layers.splice(fromIndex, 1)[0]);

    const idx = this.layerIndex(currentLayer);
    this.selectLayer(idx);

    this.renderTexture();
    this._sendUpdateEvent();
  }

  render() {
    const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext("2d");

    this.layers.forEach((layer) => {
      if (!layer.visible) { return; }

      ctx.drawImage(layer.render(), 0, 0);
    });

    return canvas;
  }

  renderTexture() {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.forEach((layer) => {
      if (!layer.visible) { return; }

      ctx.drawImage(layer.render(), 0, 0);
    });

    this._sendRenderEvent();
    this.texture.needsUpdate = true;
  }

  isBlank() {
    const canvas = this.render();
    const ctx = canvas.getContext("2d");

    return !ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT).data.some(pixel => pixel !== 0);
  }

  _setupTexture() {
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
  }

  _sendUpdateEvent() {
    this.dispatchEvent(new CustomEvent("layers-update"));
  }

  _sendRenderEvent() {
    this.dispatchEvent(new CustomEvent("layers-render"));
  }
}

class Layer extends EventTarget {
  constructor(id, texture) {
    super();

    this.id = id;
    this.texture = texture;
    this.oldTexture = texture;
    this.compositor = new Compositor();
  }
  
  selected = false;
  visible = true;

  render(canvas = this.texture.image) {
    return this.compositor.render(canvas);
  }

  getBaseCanvas() {
    const img = this.texture.image;
    const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    return canvas;
  }

  getBaseImageData() {
    return this.getBaseCanvas().getContext("2d").getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  }

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

  hasFilters() {
    return this.compositor.getFilters().length > 0;
  }

  findFilter(condition) {
    return this.compositor.getFilters().find(filter => condition(filter.properties));
  }
  
  // https://stackoverflow.com/questions/51371648/converting-from-a-uint8array-to-a-string-and-back
  serialize() {
    const binString = String.fromCharCode(...this.getBaseImageData().data);
    return {
      filters: this.compositor.serializeFilters(),
      data: btoa(binString),
      selected: this.selected,
      visible: this.visible,
    }
  }

  swapBodyOverlayTexture(variant) {
    return swapBodyOverlay(this.getBaseCanvas(), variant);
  }

  swapFrontBackTexture(variant) {
    return swapFrontBack(this.getBaseCanvas(), variant);
  }
}

export { Layers, Layer };
