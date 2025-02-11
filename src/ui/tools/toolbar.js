import { css, html, LitElement } from "lit";
import Tool from "./tool";
import { PART_HTML, PART_STYLES } from "./part_toggles";

class Toolbar extends LitElement {
  static styles = [
    PART_STYLES,
    css`
      :host {
        display: block;
        height: auto;
        padding: 0.25rem;
        width: 3.75rem;
        background-color: #131315;
        box-sizing: border-box;
      }

      #toolbar {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.25rem;
      }

      #tools {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      ncrs-toggle ncrs-icon {
          width: 20px;
          height: 20px;
          display: inline-block
      }

      #toggle-variant > div {
        padding-left: 0.25rem;
        width: 48px;
        height: 48px;
        image-rendering: pixelated;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          display: block;
          width: 20px;
          height: 20px;
          background: var(--background-before);
          background-size: 40px;
          filter: brightness(80%);
        }

        &::after {
          content: "";
          position: absolute;
          display: block;
          width: 24px;
          height: 24px;
          background: var(--background-after);
          background-size: 48px;
          right: 10px;
          top: 10px;
          outline: 2px white solid;
        }
      }

      #toggle-classic {
        --background-before: url("/images/steve_alex.png") 20px 0px;
        --background-after: url("/images/steve_alex.png") 0px 0px;
      }

      #toggle-slim {
        --background-before: url("/images/steve_alex.png") 0px 0px;
        --background-after: url("/images/steve_alex.png") 24px 0px;
      }
  `];

  constructor(ui) {
    super();

    this.ui = ui;
  }

  render() {
    this._setupEvents();

    return html`
      <div id="toolbar">
        ${this._renderTools()}
        ${this._renderToggles()}
      </div>
    `;
  }

  select(tool) {
    this.shadowRoot.querySelectorAll("ncrs-tool").forEach(element => {
      element.active = (tool == element.tool);
    })
  }

  _setupEvents() {
    this.ui.editor.addEventListener("select-tool", event => {
      this.select(event.detail.tool);
    });
  }

  _renderTools() {
    const div = document.createElement("div");
    div.id = "tools";

    this.ui.editor.tools.forEach(tool => {
      div.appendChild(
        new Tool(this.ui, tool)
      )
    });

    return div;
  }

  _renderToggles() {
    return html`
      <div>
        ${PART_HTML(this)}
        <ncrs-toggle title="Toggle skin model" id="toggle-variant" @toggle=${this._toggleSkinModel}>
          <div id="toggle-classic" slot="off">
          </div>
          <div id="toggle-slim" slot="on">
          </div>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle overlay" toggled @toggle=${this._toggleOverlay}>
          <ncrs-icon slot="before" icon="armor" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle base" toggled @toggle=${this._toggleBase}>
          <ncrs-icon slot="before" icon="player" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle grid" toggled @toggle=${this._toggleGrid}>
          <ncrs-icon slot="before" icon="grid" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
        </ncrs-toggle>
      </div>
    `;
  }

  _toggleSkinModel(event) {
    const model = event.detail ? "slim" : "classic";
    this.ui.editor.setVariant(model);
  }

  _toggleOverlay(event) {
    this.ui.editor.setOverlayVisible(event.detail);
  }

  _toggleBase(event) {
    this.ui.editor.setBaseVisible(event.detail);
  }

  _toggleGrid(event) {
    this.ui.editor.setGridVisible(event.detail);
  }

  _toggleHeadPart(event) {
    this.ui.editor.setPartVisible("head", event.detail);
  }

  _toggleRArmPart(event) {
    this.ui.editor.setPartVisible("arm_right", event.detail);
  }

  _toggleTorsoPart(event) {
    this.ui.editor.setPartVisible("torso", event.detail);
  }

  _toggleLArmPart(event) {
    this.ui.editor.setPartVisible("arm_left", event.detail);
  }

  _toggleRLegPart(event) {
    this.ui.editor.setPartVisible("leg_right", event.detail);
  }

  _toggleLLegPart(event) {
    this.ui.editor.setPartVisible("leg_left", event.detail);
  }
}

customElements.define("ncrs-toolbar", Toolbar);

export default Toolbar;