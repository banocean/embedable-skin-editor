import { css, html, LitElement } from "lit";
import Tool from "./tool";
import PartToggle from "./part_toggles";

class Toolbar extends LitElement {
  static styles = css`
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

    ncrs-toggle ncrs-icon, ncrs-troggle ncrs-icon {
        width: 20px;
        height: 20px;
        display: inline-block
    }

    .hidden {
      display: none;
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

    ncrs-part-toggle {
      margin-bottom: 1rem;
    }
  `;

  constructor(ui) {
    super();

    this.ui = ui;
    this.partToggles = new PartToggle(this.ui.editor);
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
    const cfg = this.ui.editor.config;
    const isSlim = cfg.get("variant") == "slim";
    const baseVisible = cfg.get("baseVisible");
    const overlayVisible = cfg.get("overlayVisible");
    const baseGridVisible = cfg.get("baseGridVisible", false);
    const overlayGridVisible = cfg.get("overlayGridVisible", false);

    let gridState = "off";
    if (overlayGridVisible) {
      gridState = "on";
    } else if (baseGridVisible) {
      gridState = "half";
    }

    return html`
      <div>
        ${this.partToggles}
        <ncrs-toggle title="Toggle skin model" id="toggle-variant" ?toggled=${isSlim} @toggle=${this._toggleSkinModel}>
          <div id="toggle-classic" slot="off">
          </div>
          <div id="toggle-slim" slot="on">
          </div>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle overlay" ?toggled=${overlayVisible} @toggle=${this._toggleOverlay}>
          <ncrs-icon slot="before" icon="armor" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle base" ?toggled=${baseVisible} @toggle=${this._toggleBase}>
          <ncrs-icon slot="before" icon="player" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle class="hidden" title="Blow Up Model" @toggle=${this._toggleBlowUp}>
          <ncrs-icon slot="before" icon="blow-up-model" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-troggle title="Toggle grid" state=${gridState} @troggle=${this._toggleGrid}>
          <ncrs-icon slot="before" icon="grid" color="white"></ncrs-icon>
          <ncrs-icon slot="off" icon="box-unchecked" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="box-checked" color="white"></ncrs-icon>
          <ncrs-icon slot="half" icon="box-halfchecked" color="white"></ncrs-icon>
        </ncrs-troggle>
        <ncrs-toggle class="hidden" title="Toggle Backface Culling" @toggle=${this._toggleBackfaceCulling}>
          <ncrs-icon slot="before" icon="backface-culling" color="white"></ncrs-icon>
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
    if (event.detail === "on") {
      this.ui.editor.setBaseGridVisible(true);
      this.ui.editor.setOverlayGridVisible(true);
    } else if (event.detail === "half") {
      this.ui.editor.setBaseGridVisible(true);
      this.ui.editor.setOverlayGridVisible(false);
    } else {
      this.ui.editor.setBaseGridVisible(false);
      this.ui.editor.setOverlayGridVisible(false);
    }
  }
}

customElements.define("ncrs-toolbar", Toolbar);

export default Toolbar;