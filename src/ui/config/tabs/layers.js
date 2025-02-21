import Color from "color";
import Tab from "../../misc/tab";
import { css, html } from "lit";
import CssFilter from "../../../editor/layers/filters/css_filter";
import Slider from "../../misc/slider";
import UpdateLayerFiltersEntry from "../../../editor/history/entries/update_layer_filters_entry";
import CloneLayerEntry from "../../../editor/history/entries/clone_layer_entry";
import MergeLayersEntry from "../../../editor/history/entries/merge_layers_entry";

const getSliderDefaults = () => {return {a: 1, h: 0.5, s: 0.5, b: 0.5}};

class LayersTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      :host {
        --current-color: #ff0000;
      }

      #container {
        background-color: #1A1A1A;
        padding: 0.25rem;
        box-sizing: border-box;
      }

      #sliders {
        padding: 0.25rem;
        padding-bottom: 0.5rem;
        margin-bottom: 0.25rem;
      }

      #sliders h2 {
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

      #opacity-slider {
        background: linear-gradient(to right, transparent, var(--current-color)),
        repeating-conic-gradient(#aaa 0% 25%, #888 0% 50%) 50%/ 8px 8px;
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

      #filter-buttons {
        display: flex;
        justify-content: center;
        gap: 0.25rem;
      }

      #filter-buttons ncrs-button {
        flex-grow: 1;
        flex-basis: 0;
        margin-bottom: 0.25rem;
        text-align: center;
        font-size: small;
      }

      ncrs-button::part(button) {
        padding: 0.25rem;
      }
    `
  ]

  constructor(editor) {
    super({name: "Layer"})
    this.editor = editor;
    this.config = editor.config;

    this._setupSliders();
    this._setupEvents();

    const scope = this;
    this.filtersUpdateCallback = function () {
      scope.loadFromCurrentLayer();
    }
  }
  currentLayer;

  filters = {
    a: 100,
    h: 0,
    s: 100,
    b: 100,
  }

  sliderProgress = getSliderDefaults();

  render() {
    return html`
      <div id="container">
        <div id="sliders">
          <h2>Filters</h2>
          <label for="hue-slider">Adjust Layer Hue</label>
          ${this.hueSlider}
          <label for="saturation-slider">Adjust Layer Saturation</label>
          ${this.saturationSlider}
          <label for="brightness-slider">Adjust Layer Brightness</label>
          ${this.brightnessSlider}
          <label for="opacity-slider">Adjust Layer Opacity</label>
          ${this.opacitySlider}
        </div>
        <div id="filter-buttons">
          <ncrs-button @click=${this._resetSliders} title="Clear all active filters on the current layer.">
            Clear Filters
          </ncrs-button>
          <ncrs-button @click=${this._mergeFilters} title="Applies the current filters to the pixels of the current layer.">
            Merge in to Layer
          </ncrs-button>
        </div>
      </div>
    `
  }

  loadFromLayer(layer) {
    if (this.currentLayer == layer) { return; }

    if (this.currentLayer) {
      this.currentLayer.compositor.removeEventListener("update-filters", this.filtersUpdateCallback);
    }

    this.currentLayer = layer;
    this.currentLayer.compositor.addEventListener("update-filters", this.filtersUpdateCallback);

    this.loadFromCurrentLayer();
  }

  loadFromCurrentLayer() {
    const layer = this.currentLayer;

    const filters = layer.compositor.getFilters();
    if (filters.length < 1) {
      this.sliderProgress = getSliderDefaults();
    }

    const sliderProgress = this.sliderProgress;


    filters.forEach(filter => {
      const properties = filter.properties;
      if (properties.name == "alpha") {
        let progress = properties.value / 100;
        sliderProgress.a = progress;
      }

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

    this.opacitySlider.progress = sliderProgress.a;
    this.hueSlider.progress = sliderProgress.h;
    this.saturationSlider.progress = sliderProgress.s;
    this.brightnessSlider.progress = sliderProgress.b;
  }

  _opacityChange(event) {
    const value = Number(event.detail.progress);

    let progress = value * 100;

    this.filters.a = progress;

    if (value == this.sliderProgress.a) { return; }

    this._syncFilters();
  }

  _hueChange(event) {
    const value = Number(event.detail.progress);

    let progress = value - 0.5;

    if (progress < 0) {
      progress += 1;
    }

    progress *= 360;

    const color = new Color(`hsl(${progress} 100% 50%)`);
    this.style.setProperty("--current-color", color.hex());

    this.filters.h = progress;

    if (value == this.sliderProgress.h) { return; }

    this._syncFilters();
  }

  _saturationChange(event) {
    const value = Number(event.detail.progress);

    let progress = value * 200;

    this.filters.s = progress;

    if (value == this.sliderProgress.s) { return; }

    this._syncFilters();
  }

  _brightnessChange(event) {
    const value = Number(event.detail.progress);

    let progress = value * 200;

    this.filters.b = progress;

    if (value == this.sliderProgress.b) { return; }

    this._syncFilters();
  }

  _sliderReset(event, reset = 0.5) {
    if (event.button == 1) {
      event.target.progress = reset;
    }
  }

  _resetSliders() {
    const layer = this.editor.layers.getSelectedLayer();
    if (!layer.hasFilters()) { return; }

    this.editor.history.add(
      new UpdateLayerFiltersEntry(this.editor.layers, layer, [], false)
    );
  }

  _mergeFilters() {}

  _syncFilters() {
    const layer = this.editor.layers.getSelectedLayer();
    if (!layer) { return; }

    const filters = this.filters;
    const newFilters = [];

    if (filters.a < 100) {
      newFilters.push(new CssFilter(`opacity(${filters.a}%)`, {name: "alpha", value: filters.a}))
    }

    if (filters.h != 0 && filters.h != 360) {
      newFilters.push(new CssFilter(`hue-rotate(${filters.h}deg)`, {name: "hue", value: filters.h}))
    }

    if (filters.s != 100) {
      newFilters.push(new CssFilter(`saturate(${filters.s}%)`, {name: "saturation", value: filters.s}))
    }

    if (filters.b != 100) {
      newFilters.push(new CssFilter(`brightness(${filters.b}%)`, {name: "brightness", value: filters.b}))
    }

    this.editor.history.add(
      new UpdateLayerFiltersEntry(this.editor.layers, layer, newFilters)
    );
  }

  _setupSliders() {
    this.opacitySlider = new Slider();
    this.opacitySlider.progress = 1;
    this.opacitySlider.id = "opacity-slider";
    this.opacitySlider.addEventListener("slider-change", event => this._opacityChange(event));
    this.opacitySlider.addEventListener("mousedown", event => this._sliderReset(event, 1));

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