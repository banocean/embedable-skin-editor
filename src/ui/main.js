import "./misc/icon";
import "./misc/button";
import "./misc/toggle";
import "./misc/troggle";
import "./misc/quadroggle";
import "./misc/modal";
import "./misc/window";
import "./misc/skin_2d";

import { css, html, LitElement, render, unsafeCSS } from "lit";
import Editor from "../editor/main";
import PersistenceManager from "../persistence";
import { getFocusedElement, isKeybindIgnored } from "../helpers";
import Modal from "./misc/modal";

import imgGridDark from "/assets/images/grid-editor-dark.png";
import imgGridGray from "/assets/images/grid-editor-gray.png";
import imgGridLight from "/assets/images/grid-editor-light.png";

import { GALLERY_URL, SKIN_LOOKUP_URL } from "../constants";
import { del } from "idb-keyval";
import passesColorAccuracyTest from "./misc/color_accuracy_test";

class UI extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      --editor-bg: url(${unsafeCSS(imgGridDark)});
      --ncrs-color-picker-height: 15rem;
    }

    #main {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .warning {
      display: none;
      align-items: center;
      gap: 0.5rem;
      pointer-events: none;
      position: absolute;
      top: 8px;
      left: 4px;
      color: #aaaaaa;
      font-size: small;
    }

    .warning svg {
      width: 1.25rem;
      height: auto;
      padding-left: 0.35rem;
    }

    :host(.has-filters) #filters-warning {
      display: flex;
    }

    :host(.layer-invisible) #layer-warning {
      display: flex;
    }

    :host(.editor-dark) {
      --editor-bg: url(${unsafeCSS(imgGridDark)});
    }

    :host(.editor-gray) {
      --editor-bg: url(${unsafeCSS(imgGridGray)});
    }

    :host(.editor-light) {
      --editor-bg: url(${unsafeCSS(imgGridLight)});
    }

    :host(.editor-light) .warning {
      color: black;
    }

    :host(.minimized) {
      --ncrs-color-picker-height: 15rem;
    }

    :host(.fullscreen) {
      --ncrs-color-picker-height: 17rem;
    }

    #editor {
      background-color: #191919;
      background-image: var(--editor-bg);
      flex-grow: 1;
      position: relative;
    }

    #layers {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
    }

    #layers ncrs-layer-list {
      flex-grow: 1;
    }

    #editor ncrs-editor {
      width: 100%;
      height: 100%;
      min-width: 240px;
    }

    #history {
      display: flex;
      justify-content: center;
      padding: 0.5rem;
      gap: 0.5rem;
      background-color: rgb(19, 19, 21);
    }

    #history button {
      all: unset;
      cursor: pointer;
    }

    #history button:disabled {
      cursor: default;
    }

    #history button:focus-visible {
      outline: 1px solid white;
    }

    #history ncrs-icon {
      --icon-color: white;
      width: 24px;
      height: 24px;
    }

    #history button:disabled ncrs-icon {
      --icon-color: #aaaaaa;
    }

    #themeSwitch {
      all: unset;
      display: block;
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
    }

    #themeSwitch ncrs-icon {
      display: none;
      width: 24px;
      height: 24px;
    }

    :host(.editor-dark) #themeSwitch ncrs-icon.dark {
      display: block;
    }

    :host(.editor-gray) #themeSwitch ncrs-icon.gray {
      display: block;
    }

    :host(.editor-light) #themeSwitch ncrs-icon.light {
      display: block;
    }

    #fullscreenSwitch {
      all: unset;
      display: block;
      cursor: pointer;
      position: absolute;
      top: 40px;
      right: 8px;
    }

    #fullscreenSwitch ncrs-icon {
      display: none;
      width: 24px;
      height: 24px;
    }

    :host(.minimized) #fullscreenSwitch ncrs-icon.minimized {
      display: block;
    }

    :host(.fullscreen) #fullscreenSwitch ncrs-icon.fullscreen {
      display: block;
    }

    :host(.editor-light) #fullscreenSwitch {
      display: none;
    }

    #fullscreenSwitchLightMode {
      all: unset;
      display: block;
      cursor: pointer;
      position: absolute;
      top: 40px;
      right: 8px;
    }

    #fullscreenSwitchLightMode ncrs-icon {
      display: none;
      width: 24px;
      height: 24px;
    }

    :host(.minimized) #fullscreenSwitchLightMode ncrs-icon.minimized {
      display: block;
    }

    :host(.fullscreen) #fullscreenSwitchLightMode ncrs-icon.fullscreen {
      display: block;
    }

    :host(.editor-gray) #fullscreenSwitchLightMode {
      display: none;
    }

    :host(.editor-dark) #fullscreenSwitchLightMode {
      display: none;
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

  // All keybind definitions, ^ = ctrl, + = shift, ! = alt

  static keybinds = {
    "b": "pen",
    "e": "eraser",
    "g": "bucket",
    "s": "shade",
    "i": "eyedropper",
    "+s": "sculpt",
    "^z": "undo",
    "^y": "redo",
    "^+z": "redo",
    "^r": "reset",
    "=": "zoomIn",
    "-": "zoomOut",
    "arrowleft": "panLeft",
    "arrowright": "panRight",
    "arrowup": "panUp",
    "arrowdown": "panDown",
    "0": "cameraReset",
    "1": "selectTools",
    "2": "selectLayer",
    "3": "selectImport",
    "4": "selectExport",
    "!t": "selectTools",
    "!l": "selectLayer",
    "!i": "selectImport",
    "!e": "selectExport",
    "+n": "addLayer",
    "delete": "removeLayer",
    "+d": "cloneLayer",
    "+m": "mergeLayer",
    "f": "toggleFullscreen",
  }

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor;

    this.exportModal = this._setupModal("export-form");
    this.galleryModal = this._setupGalleryModal();

    this._setEditorTheme();
    this._setFullscreen();
    this._setupEvents();

    this.classList.replace("minimized", "fullscreen");
  }
  currentLayer;

  firstUpdated() {
    document.addEventListener("keydown", event => {
      const element = event.originalTarget || getFocusedElement();
      if (isKeybindIgnored(element)) { return; }

      switch(this.checkKeybinds(event)){
        case "undo":
          this.editor.history.undo();
          break;
        case "redo":
          this.editor.history.redo();
          break;
        case "cameraReset":
          this.editor.resetCamera();
          break;
      }
    });

    this._updateWarning();
  }

  checkKeybinds(event) {
    let key = '';
    if (event.ctrlKey) {
      key+='^';
    }
    if (event.altKey) {
      key+='!';
    }
    if (event.shiftKey) {
      key+='+';
    }
    key+=event.key.toLowerCase();
    if (key in this.constructor.keybinds) {
      return this.constructor.keybinds[key];
    }
  }

  render() {
    return html`
      <div id="main">
        <div id="editor">
          ${this.editor}
          ${this._historyButtons()}
        </div>
        ${this._setupColorCheckModal()}
      </div>
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

  toggleEditorBackground() {
    if (this.classList.contains("editor-gray")) {
      this.classList.replace("editor-gray", "editor-light");
      this.persistence.set("theme", "light");
    } else if (this.classList.contains("editor-light")) {
      this.classList.replace("editor-light", "editor-dark");
      this.persistence.set("theme", "dark");
    } else {
      this.classList.remove("editor-dark", "editor-light");
      this.classList.add("editor-gray");
      this.persistence.set("theme", "gray");
    }
  }

  toggleFullscreen() {
    if (this.classList.contains("minimized")) {
      this.classList.replace("minimized", "fullscreen");
    } else if (this.classList.contains("fullscreen")) {
      this.classList.replace("fullscreen", "minimized");
    }
  }

  _setEditorTheme() {
    if (
      !this.classList.contains("editor-dark") ||
      !this.classList.contains("editor-gray") ||
      !this.classList.contains("editor-light")
    ) {
      const theme = this.persistence.get("theme", "dark");
      this.classList.add(`editor-${theme}`);
    }
  }

  _setFullscreen() {
    const fullscreen = "minimized";
    this.classList.add(fullscreen);
  }

  _historyButtons() {
    const undoDisabled = !this.editor.history.canUndo();
    const redoDisabled = !this.editor.history.canRedo();

    return html`
      <div id="history">
        <button title="Undo [Ctrl + Z]" ?disabled=${undoDisabled} @click=${this._undo}>
          <ncrs-icon icon="undo" color="var(--icon-color)"></ncrs-icon>
        </button>
        <button title="Redo [Ctrl + Y]" ?disabled=${redoDisabled} @click=${this._redo}>
          <ncrs-icon icon="redo" color="var(--icon-color)"></ncrs-icon>
        </button>
      </div>
    `
  }

  _undo() {
    this.editor.history.undo();
  }

  _redo() {
    this.editor.history.redo();
  }

  _updateWarning() {
    const layer = this.editor.layers.getSelectedLayer();
    if (!layer) { return; }

    this.classList.remove("has-filters", "layer-invisible");
    
    if (!layer.visible) {
      return this.classList.add("layer-invisible");
    } else if (layer.hasFilters()) {
      return this.classList.add("has-filters");
    }
  }

  _setupModal(name) {
    const modal = new Modal();
    modal.part = name;
    
    const slot = document.createElement("slot");
    slot.name = name;

    modal.appendChild(slot);

    return modal
  }

  _setupGalleryModal() {
    const modal = new Modal();
    // const gallery = new Gallery(this);
    // gallery.url = "http://127.0.0.1:3000/gallery/skins"

    // modal.appendChild(gallery);

    return modal;
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

  _setupEvents() {
    const layers = this.editor.layers;
    layers.addEventListener("layers-render", () => {
      this._updateWarning();
    });

    layers.addEventListener("update-filters", () => {
      this._updateWarning();
    });

    layers.addEventListener("layers-select", () => {
      this._updateWarning();
    });

    this.editor.history.addEventListener("update", () => {
      this.requestUpdate();
    })

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
