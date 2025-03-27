import Color from "color";

const IMAGE_WIDTH = 64, IMAGE_HEIGHT = 64

class NCRSLegacyVersion extends BaseVersion {
  constructor(data) {
    super(undefined, data);

    this.format = 3;
  }

  // Hard code version check to true, as old NCRS files are not consistent.
  versionCheck(_data) {
    return true;
  }

  // Make format always considered valid, errors will be fixed in conversion.
  validateData(_data) {
    return true;
  }

  convert(data) {
    const model = this._parseModel(data);
    const blendPalette = this._parseBlendPalette(data);
    const layers = this._parseLayers(data);

    return {
      format: this.format,
      variant: model,
      blendPalette: blendPalette,
      layers: layers,
    }
  }

  _parseModel(data) {
    switch (data.model) {
      case "skin": { return "classic"; }
      case "skinAlex": { return "slim"; }
      default: { return "classic"; }
    }
  }

  _parseBlendPalette(data) {
    if (!data.blendPalette instanceof Array) { return []; }
    if (data.blendPalette.length < 1) { return []; }

    return data.blendPalette.map(entry => {
      return "#" + entry.toString().toUpperCase();
    })
  }

  _parseLayers(data) {
    if (typeof data.data !== "object") { return []; }

    const layers = data.data.layers;
    if (typeof layers !== "object") { return []; }

    const unorderedLayers = Object.values(layers).map((layer, idx) => {
      return this._parseLayers(layer, idx);
    }).filter(e => e);

    return unorderedLayers.sort((a, b) => a.order - b.order).map(e => e.layer);
  }

  _parseLayer(layer, idx) {
    const visible = layer.visible || false;
    const selected = layer.selected || false;
    const order = layer.order || idx;
    const data = this._parseTextureData(layer.faces);

    const layer = {
      filters: [],
      data: data,
      selected: selected,
      visible: visible,
    }

    return {order: order, layer: layer}
  }

  _parseTextureData(textureData) {
    const canvas = new OffscreenCanvas();
    const ctx = canvas.getContext("2d");

    if (textureData instanceof Array) {
      textureData.forEach((pixel, idx) => {
        const x = idx % IMAGE_WIDTH;
        const y = Math.floor(idx / IMAGE_HEIGHT);
        
        const color = new Color(pixel);
        
        ctx.fillStyle = color.hex();
        ctx.fillRect(x, y, 1, 1);
      })
    }

    return this._toBinString(ctx);
  }

  _toBinString(ctx) {
    const imageData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    const binString = String.fromCharCode(...imageData.data);
    return btoa(binString);
  }
}

export default NCRSLegacyVersion;