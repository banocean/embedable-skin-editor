import Config from "../config";
import Color from "color";
import { getRandomInt, pickFromArray } from "../../helpers";

const DEFAULTS = {
  size: 1,
  shape: "square",
  color: new Color("#E8453C"),
  camo: false,
  blend: false,
  force: 5,
}

class ToolConfig extends Config {
  constructor() {
    super(DEFAULTS);
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
}

export default ToolConfig;
