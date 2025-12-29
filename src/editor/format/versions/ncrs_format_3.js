import BaseVersion from "../base_version.js";
import NCRSLegacyVersion from "./ncrs_legacy.js";
import validate from "./schemas/schema_3.js";

class NCRSFormat3 extends BaseVersion {
  static exportEditor(editor) {
    return {
      format: 3,
      variant: editor.config.get("variant"),
      layers: editor.layers.serializeLayers(),
      blendPalette: editor.toolConfig.get("blend-palette"),
    };
  }

  constructor(data) {
    super(NCRSLegacyVersion, data, 3);
  }

  checkData(data) {
    if (this.versionCheck(data)) {
      return data;
    } else if (!!data.format) {
      return this.convert(data);
    } else {
      const transformedData = this.transformData(data);
      return transformedData;
    }
  }

  convert(data) {
    data.format = this.format;

    return data;
  }

  validateData(data) {
    return validate(data);
  }

  loadEditor(editor) {
    editor.history.wipe();

    editor.config.set("variant", this.data.variant);
    editor.toolConfig.set("blend-palette", this.data.blendPalette);

    editor.layers.layers = [];
    this.data.layers.forEach(layer => {
      const deserializedLayer = editor.layers.deserializeLayer(layer);
      editor.layers.addLayer(deserializedLayer);
    });
  }
}

export default NCRSFormat3;