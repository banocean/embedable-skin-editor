import AJV from "../ajv";
import BaseVersion from "../base_version";
import NCRSLegacyVersion from "./ncrs_legacy";

const schema3 = {
  type: "object",
  properties: {
    format: {type: "integer"},
    variant: {
      type: "string",
      pattern: "^(classic|slim)$"
    },
    layers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          filters: {type: "array"},
          data: {type: "string"},
          selected: {type: "boolean"},
          visible: {type: "boolean"},
        }
      }
    },
    blendPalette: {
      type: "array",
      items: {
        type: "string",
        pattern: "^#([a-fA-F0-9]{8}|[a-fA-F0-9]{6})$"
      }
    }
  }
}

const validate = AJV.compile(schema3);

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
    const valid = validate(data);

    if (!valid) { console.log(validate.errors, data); }

    return valid;
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