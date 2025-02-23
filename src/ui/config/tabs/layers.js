import Color from "color";
import Tab from "../../misc/tab";
import { css, html } from "lit";
import UpdateLayerFiltersEntry from "../../../editor/history/entries/update_layer_filters_entry";
import MergeFiltersEntry from "../../../editor/history/entries/merge_filters_entry";
import BrightnessFilterSlider from "./layers/brightness_filter_slider";
import AlphaFilterSlider from "./layers/alpha_filter_slider";
import HueFilterSlider from "./layers/hue_filter_slider";
import SaturationFilterSlider from "./layers/saturation_filter_slider";

class LayersTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      :host {
        --current-color: #ff0000;
      }

      #container {
        background-color: #1a1a1a;
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
        background-image: linear-gradient(
          to right,
          rgb(0, 255, 255),
          rgb(0, 0, 255),
          rgb(255, 0, 255),
          rgb(255, 0, 0),
          rgb(255, 255, 0),
          rgb(0, 255, 0),
          rgb(0, 255, 255)
        );
      }

      #saturation-slider {
        background: linear-gradient(
          to right,
          hsl(from var(--current-color) h 0% l),
          hsl(from var(--current-color) h 100% l),
          hsl(from var(--current-color) h 200% l)
        );
      }

      #brightness-slider {
        background: linear-gradient(
          to right,
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
    `,
  ];

  constructor(editor) {
    super({ name: "Layer" });
    this.editor = editor;
    this.config = editor.config;

    this.sliders = this._setupSliders();
  }

  render() {
    return html`
      <div id="container">
        <div id="sliders">
          <h2>Filters</h2>
          <label for="hue-slider">Adjust Layer Hue</label>
          ${this.hueSlider.slider}
          <label for="saturation-slider">Adjust Layer Saturation</label>
          ${this.saturationSlider.slider}
          <label for="brightness-slider">Adjust Layer Brightness</label>
          ${this.brightnessSlider.slider}
          <label for="opacity-slider">Adjust Layer Opacity</label>
          ${this.opacitySlider.slider}
        </div>
        <div id="filter-buttons">
          <ncrs-button @click=${this._resetSliders} title="Clear all active filters on the current layer.">
            Clear Filters
          </ncrs-button>
          <ncrs-button
            @click=${this._mergeFilters}
            title="Applies the current filters to the pixels of the current layer."
          >
            Merge in to Layer
          </ncrs-button>
        </div>
      </div>
    `;
  }

  _resetSliders() {
    const layer = this.editor.layers.getSelectedLayer();
    if (!layer.hasFilters()) {
      return;
    }

    this.editor.history.add(new UpdateLayerFiltersEntry(this.editor.layers, layer, [], false));
  }

  _mergeFilters() {
    const layer = this.editor.layers.getSelectedLayer();
    if (!layer.hasFilters()) {
      return;
    }

    this.editor.history.add(new MergeFiltersEntry(this.editor.layers, layer));
  }

  _syncFilters() {
    const color = new Color(`hsl(${this.hueSlider.getValue()} 100% 50%)`);
    this.style.setProperty("--current-color", color.hex());

    const layer = this.editor.layers.getSelectedLayer();
    if (!layer) {
      return;
    }
    const newFilters = [];

    this.sliders.forEach(slider => {
      if (slider.isDefault()) { return; }
      newFilters.push(slider.toFilter());
    });

    this.editor.history.add(new UpdateLayerFiltersEntry(this.editor.layers, layer, newFilters));
  }

  _setupSliders() {
    const layers = this.editor.layers;
    this.opacitySlider = new AlphaFilterSlider(layers);
    this.opacitySlider.slider.id = "opacity-slider"

    this.hueSlider = new HueFilterSlider(layers);
    this.hueSlider.slider.id = "hue-slider"

    this.saturationSlider = new SaturationFilterSlider(layers);
    this.saturationSlider.slider.id = "saturation-slider"

    this.brightnessSlider = new BrightnessFilterSlider(layers);
    this.brightnessSlider.slider.id = "brightness-slider"

    const sliders = [this.opacitySlider, this.hueSlider, this.saturationSlider, this.brightnessSlider];

    sliders.forEach(element => {
      element.addEventListener("slider-change", () => this._syncFilters());
    })

    return sliders;
  }
}

customElements.define("ncrs-layers-tab", LayersTab);

export default LayersTab;
