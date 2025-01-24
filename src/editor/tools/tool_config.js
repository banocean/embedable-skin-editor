import Color from "color";
import { getRandomInt, pickFromArray } from "../../helpers";

const DEFAULTS = {
  size: 1,
  shape: "square",
  color: new Color("#ffff00"),
  camo: false,
  blend: false,
}

class ToolConfig extends EventTarget {
  #config = {};

  constructor() {
    super();

    this._setDefaults();
  }

  get(key, fallback = undefined) {
    if (this.#config[key]) {
      return this.#config[key];
    }
    
    return fallback;
  }

  set(key, value) {
    if (this.#config[key] === value) {
      return value;
    }

    this.#config[key] = value;
    this.dispatchEvent(new CustomEvent(`${key}-change`, { detail: value }));

    return value;
  }

  getColor() {
    let color = this.get("color");

    if (this.get("blend")) {
      const palette = this.get("blend-palette", [color.hex()]);

      color = new Color(pickFromArray(palette));
    }

    if (this.get("camo")) {
      let rand = getRandomInt(50);
      rand -= 25;
      rand /= 100;
      
      color = color.lighten(rand);
    }

    return color;
  }

  _setDefaults() {
    Object.keys(DEFAULTS).forEach(key => {
      this.set(key, DEFAULTS[key]);
    })
  }
}

export default ToolConfig;
