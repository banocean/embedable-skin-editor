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
          filters: {type: "object"},
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
  constructor(data) {
    super(NCRSLegacyVersion, data);

    this.format = 3;
  }

  validateData(data) {
    return validate(data);
  }
}

export default NCRSFormat3;