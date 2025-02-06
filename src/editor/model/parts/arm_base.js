import { BasePart } from "../base";

const WIDTHS = {
  classic: 0.5,
  slim: 0.375,
}

class ArmBasePart extends BasePart {
  constructor(texture, variant) {
    super(texture, variant);
  }

  size() {
    const width = WIDTHS[this.variant];

    return {
      base: [width, 1.5, 0.5],
      overlay: [width + 0.0625, 1.5625, 0.5625]
    }
  }
}

export {ArmBasePart}