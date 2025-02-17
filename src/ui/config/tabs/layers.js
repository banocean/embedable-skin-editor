import Color from "color";
import Tab from "../../misc/tab";
import { css, html } from "lit";

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
    super({name: "Layers"})
    this.editor = editor;
    this.config = editor.config;
  }

  render() {
    return html`
      <fieldset id="sliders">
        <legend>Filters</legend>
        <label for="hue-slider">Adjust Layer Hue</label>
        <ncrs-slider id="hue-slider" progress="0.5" steps="360" @slider-change=${this._hueChange} @mousedown=${this._sliderReset}></ncrs-slider>
        <label for="hue-slider">Adjust Layer Saturation</label>
        <ncrs-slider id="saturation-slider" progress="0.5" @mousedown=${this._sliderReset}></ncrs-slider>
        <label for="hue-slider">Adjust Layer Brightness</label>
        <ncrs-slider id="brightness-slider" progress="0.5" @mousedown=${this._sliderReset}></ncrs-slider>
      </fieldset>
    `
  }

  _hueChange(event) {
    let progress = Number(event.detail.progress) - 0.5;

    if (progress < 0) {
      progress += 1;
    }

    const color = new Color(`hsl(${progress * 360} 100% 50%)`);
    this.style.setProperty("--current-color", color.hex());
  }

  _sliderReset(event) {
    if (event.button == 1) {
      event.target.progress = 0.5;
    }
  }
}

customElements.define("ncrs-layers-tab", LayersTab);

export default LayersTab;