import CssFilter from "../../../../editor/layers/filters/css_filter.js";
import BaseFilterSlider from "./base_filter_slider.js";

class BrightnessFilterSlider extends BaseFilterSlider {
  constructor(layers) {
    super(layers, {
      name: "brightness",
      default: 0.5,
    });

    this.slider.unclamped = true;
  }

  getValue() {
    return this.getProgress() * 200;
  }

  toFilter() {
    return new CssFilter(`brightness(${this.getValue()}%)`, {name: this.name, value: this.getProgress()});
  }
}

export default BrightnessFilterSlider;