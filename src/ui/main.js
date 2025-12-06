import "./misc/icon";
import "./misc/button";
import "./misc/toggle";
import "./misc/troggle";
import "./misc/quadroggle";
import "./misc/modal";
import "./misc/window";
import "./misc/skin_2d";

import { css, html, LitElement } from "lit";
import Editor from "../editor/main.js";
import PersistenceManager from "../persistence.js";
import Modal from "./misc/modal.js";

import { GALLERY_URL, SKIN_LOOKUP_URL } from "../constants.js";
import passesColorAccuracyTest from "./misc/color_accuracy_test.js";
import setupKeybinds from "./keybinds.js";
import NCRSUIDesktopLayout from "./layouts/desktop.js";
import NCRSUIMobileLayout from "./layouts/mobile.js";

const DESKTOP_MIN_WIDTH = 670;

class UI extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    #main {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
    }

    #color-check-modal {
      justify-content: center;
      position: absolute;
    }
    
    #color-check {
      color: white;
      background-color: #1A1A1A;
      padding: 1rem;
      border-radius: 0.25rem;
      max-width: 32rem;
    }

    #color-check h2 {
      margin: 0px;
      text-align: center;
    }

    #color-check a {
      color: white;
    }

    #color-check div {
      display: flex;
      gap: 0.25rem;
      margin-top: 1rem;
    }

    #color-check ncrs-button {
      flex-grow: 1;
      flex-basis: 0;
    }

    #color-check ncrs-button::part(button) {
      padding: 0.25rem;
      text-align: center;
      font-size: large;
    }
  `;

  static properties = {
    src: {type: String},
    _warning: {type: String, state: true},
  }

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor();

    this.exportModal = this._setupModal("export-form");

    this.layout = new NCRSUIDesktopLayout(this);

    this._setFullscreen();
    this._setupResizeObserver();
    this._setupEvents();
  }

  firstUpdated() {
    setupKeybinds(this.editor, this.config);
  }

  render() {
    return html`
      <div id="main">
        ${this.layout}
        ${this._setupColorCheckModal()}
      </div>
      ${this.exportModal}
      ${this.galleryModal}
      <slot name="footer"></slot>
    `;
  }

  galleryURL() {
    if (!this.src) { return GALLERY_URL };

    const url = new URL(this.src);

    return `${url.origin}/gallery/skins`;
  }

  skinLookupURL() {
    if (!this.src) { return SKIN_LOOKUP_URL };

    const url = new URL(this.src);

    return `${url.origin}/api/skin`;
  }

  toggleFullscreen() {
    if (this.classList.contains("minimized")) {
      this.classList.replace("minimized", "fullscreen");
    } else if (this.classList.contains("fullscreen")) {
      this.classList.replace("fullscreen", "minimized");
    }
  }

  _getValidLayout() {
    if (this.clientWidth >= DESKTOP_MIN_WIDTH) {
      return "desktop";
    } else {
      return "mobile";
    }
  }

  _getLayout(id) {
    if (id === "desktop") return new NCRSUIDesktopLayout(this);
    if (id === "mobile") return new NCRSUIMobileLayout(this);
  }

  _setFullscreen() {
    const fullscreen = "minimized";
    this.classList.add(fullscreen);
  }

  _setupModal(name) {
    const modal = new Modal();
    modal.part = name;
    
    const slot = document.createElement("slot");
    slot.name = name;

    modal.appendChild(slot);

    return modal
  }

  _setupColorCheckModal() {
    return html`
      <ncrs-modal id="color-check-modal">
        <div id="color-check">
          <h2>Color Inaccuracies Detected</h2>
          <p>We have detected that your browser may have issues with color accuracy.</p>
          <p>You may notice subtle visual noise and incorrect colors appear in your skins.</p>
          <p>This issue is usually caused by anti-fingerprinting privacy settings in your browser.</p>
          <a href="https://wiki.needcoolershoes.com/troubleshooting/inaccurate_colors/" target="_blank">Learn how to fix</a>
          <div>
            <ncrs-button @click=${this._closeColorModal}>Close</ncrs-button>
            <ncrs-button @click=${this._ignoreColorModal}>Do Not Show Again</ncrs-button>
          </div>
        </div>
      </ncrs-modal>
    `;
  }

  _closeColorModal() {
    this.shadowRoot.getElementById("color-check-modal").hide();
  }

  _ignoreColorModal() {
    this.persistence.set("ignoreColorCheck", true);
    this.shadowRoot.getElementById("color-check-modal").hide();
  }

  _runColorCheck() {
    if (this.persistence.get("ignoreColorCheck", false)) { return; }
    if (passesColorAccuracyTest()) { return; }

    this.shadowRoot.getElementById("color-check-modal").show();
  }

  _setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      const validLayout = this._getValidLayout();

      if (this.layout.id === validLayout) return;

      this.editor.mobile = (validLayout === "mobile");

      delete this.layout;
      this.layout = this._getLayout(validLayout);

      this.requestUpdate();
    });

    resizeObserver.observe(this);
  }

  _setupEvents() {
    this.addEventListener("dragover", event => event.preventDefault());
    this.addEventListener("drop", event => {
      event.preventDefault();
      [...event.dataTransfer.items].forEach(item => {
        if (item.type != "image/png") { return; }

        this.editor.addLayerFromFile(item.getAsFile());
      })
    });

    window.addEventListener("load", () => {
      this._runColorCheck();
    })
  }
}

customElements.define("ncrs-ui", UI);

export default UI;