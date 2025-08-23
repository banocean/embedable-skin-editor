import { css, html, LitElement } from "lit";

class EditorToggles extends LitElement {
  static styles = css`
    .ncrs-toggle-row {
      display: flex;
      flex-direction: row;
      gap: 0;
      align-items: center;
      justify-content: center;
      padding-bottom: 2px;
      padding-top: 1px;
    }

    ncrs-toggle {
      display: block;
      width: 25px;
    }

    ncrs-toggle ncrs-icon {
        width: 25px;
        height: 25px;
        display: block;
    }

    ncrs-toggle::part(button):focus-visible, ncrs-quadroggle::part(button):focus-visible {
      outline: 1px solid white;
    }

    .hidden {
      display: none;
    }
  `;

  constructor(editor) {
    super();

    this.editor = editor;
  }

  render() {
    const cfg = this.editor.config;

    const baseVisible = cfg.get("baseVisible");
    const overlayVisible = cfg.get("overlayVisible");
    const baseGridVisible = cfg.get("baseGridVisible", false);
    const overlayGridVisible = cfg.get("overlayGridVisible", false);
    const cullBackFace = cfg.get("cullBackFace", true);

    return html`
      <div class="ncrs-toggle-row">
        <ncrs-toggle title="Toggle base" ?toggled=${baseVisible} @toggle=${this._toggleBase}>
          <ncrs-icon slot="off" icon="base" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="base" color="#55b2ff"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle overlay" ?toggled=${overlayVisible} @toggle=${this._toggleOverlay}>
          <ncrs-icon slot="off" icon="overlay" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="overlay" color="#55b2ff"></ncrs-icon>
        </ncrs-toggle>
      </div>
      <div class="ncrs-toggle-row">
        <ncrs-toggle title="Toggle base grid" ?toggled=${baseGridVisible} @toggle=${this._toggleBaseGrid}>
          <ncrs-icon slot="off" icon="base-grid" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="base-grid" color="#55b2ff"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle title="Toggle overlay grid" ?toggled=${overlayGridVisible} @toggle=${this._toggleOverlayGrid}>
          <ncrs-icon slot="off" icon="overlay-grid" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="overlay-grid" color="#55b2ff"></ncrs-icon>
        </ncrs-toggle>
      </div>
      <div class="ncrs-toggle-row">
        <ncrs-toggle title="Toggle Backface Culling" ?toggled=${cullBackFace} @toggle=${this._toggleBackfaceCulling}>
          <ncrs-icon slot="off" icon="backface-culling" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="backface-culling" color="#55b2ff"></ncrs-icon>
        </ncrs-toggle>
        <ncrs-toggle class="hidden" title="Toggle Shading" ?toggled=${cullBackFace} @toggle=${this._toggleShading}>
          <ncrs-icon slot="off" icon="shade" color="white"></ncrs-icon>
          <ncrs-icon slot="on" icon="shade" color="#55b2ff"></ncrs-icon>
        </ncrs-toggle>
      </div>
      <ncrs-toggle class="hidden" title="Blow Up Model" @toggle=${this._toggleBlowUp}>
        <ncrs-icon slot="off" icon="blow-up-model" color="white"></ncrs-icon>
        <ncrs-icon slot="on" icon="blow-up-model" color="#55b2ff"></ncrs-icon>
      </ncrs-toggle>
    `;
  }

  _toggleOverlay(event) {
    this.editor.setOverlayVisible(event.detail);
  }

  _toggleBase(event) {
    this.editor.setBaseVisible(event.detail);
  }

  _toggleOverlayGrid(event) {
    this.editor.setOverlayGridVisible(event.detail);
  }

  _toggleBaseGrid(event) {
    this.editor.setBaseGridVisible(event.detail);
  }

  _toggleBackfaceCulling(event) {
    this.editor.config.set("cullBackFace", event.detail);
  }
}

customElements.define("ncrs-tools-editor-toggles", EditorToggles);
export default EditorToggles;