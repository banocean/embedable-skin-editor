import Color from "color";
import Tab from "../../misc/tab";
import { css, html } from "lit";
import CssFilter from "../../../editor/layers/filters/css_filter";
import Slider from "../../misc/slider";

class LayersTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      :host {
        padding: 0.25rem;
        box-sizing: border-box;
        --current-color: #000;
      }

      #sliders {
        border: 1px white solid;
        border-radius: 0.25rem;
        padding: 0.25rem;
        padding-bottom: 0.5rem;
      }

      #sliders legend {
        margin: 0px;
        font-size: medium;
        color: white;
      }

      #sliders label {
        font-size: x-small;
        color: white;
      }

      #sliders ncrs-slider {
        width: 100%;
        height: 1rem;
        border-radius: 0.25rem;
      }

      #hue-slider {
        background-image: linear-gradient(to right, rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255));
      }

      #saturation-slider {
        background: linear-gradient(to right,
          hsl(from var(--current-color) h 0% l),
          hsl(from var(--current-color) h 100% l),
          hsl(from var(--current-color) h 200% l)
        );
      }

      #brightness-slider {
        background: linear-gradient(to right,
          hsl(from var(--current-color) h s 0%),
          hsl(from var(--current-color) h s l),
          hsl(from var(--current-color) h s 100%)
        );
      }
    `
  ]

  constructor(editor) {
    super({name: "Layer"})
    this.editor = editor;
    this.config = editor.config;

    this._setupSliders();
    this._setupEvents();
  }

  filters = {
    h: 0,
    s: 100,
    b: 100,
  }

  render() {
    return html`
      <fieldset id="sliders">
        <legend>Filters</legend>
        <label for="hue-slider">Adjust Layer Hue</label>
        ${this.hueSlider}
        <label for="saturation-slider">Adjust Layer Saturation</label>
        ${this.saturationSlider}
        <label for="brightness-slider">Adjust Layer Brightness</label>
        ${this.brightnessSlider}
      </fieldset>
    `
  }

  loadFromLayer(layer) {
    const filters = layer.compositor.filters;
    const sliderProgress = {h: 0.5, s: 0.5, b: 0.5};

    filters.forEach(filter => {
      const properties = filter.properties;
      if (properties.name == "hue") {
        let progress = properties.value / 360;
        progress += 0.5;

        if (progress > 1) {
          progress -= 1;
        }

        sliderProgress.h = progress;
      }

      if (properties.name == "saturation") {
        let progress = properties.value / 200;
        sliderProgress.s = progress;
      }

      if (properties.name == "brightness") {
        let progress = properties.value / 200;
        sliderProgress.b = progress;
      }
    });

    this.hueSlider.progress = sliderProgress.h;
    this.saturationSlider.progress = sliderProgress.s;
    this.brightnessSlider.progress = sliderProgress.b;
  }

  _hueChange(event) {
    let progress = Number(event.detail.progress) - 0.5;

    if (progress < 0) {
      progress += 1;
    }

    progress *= 360;

    const color = new Color(`hsl(${progress} 100% 50%)`);
    this.style.setProperty("--current-color", color.hex());

    this.filters.h = progress;
    this._syncFilters();
  }

  _saturationChange(event) {
    let progress = Number(event.detail.progress) * 200;

    this.filters.s = progress;
    this._syncFilters();
  }

  _brightnessChange(event) {
    let progress = Number(event.detail.progress) * 200;

    this.filters.b = progress;
    this._syncFilters();
  }

  _sliderReset(event) {
    if (event.button == 1) {
      event.target.progress = 0.5;
    }
  }

  _syncFilters() {
    const layer = this.editor.layers.getSelectedLayer();
    if (!layer) { return; }

    const filters = this.filters;
    const newFilters = [];

    if (filters.h != 0 && filters.h != 360) {
      newFilters.push(new CssFilter(`hue-rotate(${filters.h}deg)`, {name: "hue", value: filters.h}))
    }

    if (filters.s != 100) {
      newFilters.push(new CssFilter(`saturate(${filters.s}%)`, {name: "saturation", value: filters.s}))
    }

    if (filters.b != 100) {
      newFilters.push(new CssFilter(`brightness(${filters.b}%)`, {name: "brightness", value: filters.b}))
    }
    layer.compositor.filters = newFilters;
    console.log(layer.compositor.filters);

    this.editor.layers.renderTexture();    
  }

  _setupSliders() {
    this.hueSlider = new Slider();
    this.hueSlider.progress = 0.5;
    this.hueSlider.steps = 360;
    this.hueSlider.id = "hue-slider";
    this.hueSlider.addEventListener("slider-change", event => this._hueChange(event));
    this.hueSlider.addEventListener("mousedown", event => this._sliderReset(event));


    this.saturationSlider = new Slider();
    this.saturationSlider.progress = 0.5;
    this.saturationSlider.id = "saturation-slider";
    this.saturationSlider.addEventListener("slider-change", event => this._saturationChange(event));
    this.saturationSlider.addEventListener("mousedown", event => this._sliderReset(event));
    
    this.brightnessSlider = new Slider();
    this.brightnessSlider.progress = 0.5;
    this.brightnessSlider.id = "brightness-slider";
    this.brightnessSlider.addEventListener("slider-change", event => this._brightnessChange(event));
    this.brightnessSlider.addEventListener("mousedown", event => this._sliderReset(event));
  }

  _setupEvents() {
    this.editor.layers.addEventListener("layers-select", () => {
      this.loadFromLayer(this.editor.layers.getSelectedLayer());
    })
  }
}

customElements.define("ncrs-layers-tab", LayersTab);

export default LayersTab;