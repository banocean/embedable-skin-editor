import BaseFilter from "./base_filter";
import { IMAGE_WIDTH, IMAGE_HEIGHT } from "../../main";

class CssFilter extends BaseFilter {
  constructor(filter) {
    super();

    this.filter = filter;
  }

  apply(input) {
    const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.filter = this.filter;
    ctx.drawImage(input, 0, 0);

    return canvas;
  }
}

export default CssFilter;