import { css, html, LitElement, unsafeCSS } from "lit";
import PersistenceManager from "../../persistence";
import { Editor } from "../../main";
import "./components/drawer";
import "./components/tab";
import "./components/tab_group";
import "../misc/color_picker";

import imgGridDark from "../../../assets/images/grid-editor-dark.png";
import Toolset from "../tools/toolset";
import { ColorDrawer, COLOR_DRAWER_STYLES } from "./color_drawer";
import interact from "interactjs";
import PartToggles from "../tools/part_toggles";
import ModelToggle from "../tools/model_toggle";
import EditorToggles from "../tools/editor_toggles";
import { CONFIG_DRAWER_STYLES, ConfigDrawer } from "./config_drawer";
import { GALLERY_URL, SKIN_LOOKUP_URL } from "../../constants";
import LayerList from "../layers/layer_list";

const STYLES = css`
  :host {
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    --editor-bg: url(${unsafeCSS(imgGridDark)});
    --ncrs-color-picker-height: 15rem;
    --current-color: black;
  }

  #main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
  }

  #editor {
    background-color: #191919;
    background-image: var(--editor-bg);
    flex-grow: 1;
    position: relative;
    overflow: hidden;
  }

  #editor ncrs-editor {
    width: 100%;
    height: 100%;
    min-width: 240px;
  }

  :host(.hide-controls) #fullscreenToggle {
    display: none;
  }

 #fullscreenToggle ncrs-icon {
    width: 1.5rem;
    height: 1.5rem;
    --icon-color: #ffffff44;
  }

  #top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 3.375rem;
    background-color: #1f2025;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  #bottom {
    position: relative;
    display: flex;
    width: 100%;
    overflow-x: scroll;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;
    background-color: #1f2025;
    box-shadow: #131315 0px -4px 4px;
    overscroll-behavior: none;
  }

  #bottom::-webkit-scrollbar {
      display: none;
  }

  #toolbar {
    padding: 0.25rem;
  }

  ncrs-tools-toolset {
    --ncrs-icon-height: 1.25rem;

    display: block;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: #131315;
    box-shadow: rgb(10, 10, 13) 0px 4px 4px inset;
  }

  ncrs-tools-toolset::part(tool) {
    flex-grow: 1;
  }

  #bottom > div {
    min-width: 100%;
    scroll-snap-align: start;
  }

  #bottom .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 6.875rem;
    padding: 0rem 2.5rem;
    box-sizing: border-box;
  }

  #menu .container {
    justify-content: center;
    gap: 3rem;
  }

  #bottom #toggles {
    height: 10.5rem;
    padding: 0rem 3rem;
    padding-top: 0.25rem;
  }

  #toggles .left {
    align-self: flex-end;
    margin-bottom: 1.75rem;
  }

  #toggles .side-button {
    margin-top: 1.75rem;
  }

  #color-button-rainbow {
    border-radius: 9999px;
    padding: 0.125rem;
    background-image: conic-gradient(from 130deg, #ff2d2d, #ff30de, #6931ff, #23beff, #26ffe5, #aaff27, #ffb720, #ff2a2a);
  }

  button {
    all: unset;
    display: block;
    cursor: pointer;
  }
  
  #color-button {
    border-radius: 9999px;
    width: 4rem;
    height: 4rem;
    background: linear-gradient(var(--current-color), var(--current-color)),
      repeating-conic-gradient(#aaa 0% 25%, #888 0% 50%) 50%/ 8px 8px;
    border: 4px solid rgb(31, 32, 37);
  }

  .side-button ncrs-icon {
    width: 3rem;
    height: 3rem;
    --icon-color: white;
    --icon-color-active: #55b2ff;
  }

  .side-right ncrs-icon {
    width: 2.25rem;
    height: 2.25rem;
  }

  ncrs-mobile-drawer {
    --base-opacity: 0.25;
    --base-blur: 1px;
    --drawer-height: 23rem;
  }
  
  ncrs-tools-part-toggles {
    --scale: 0.9;
    --gap: 0.75rem 0.8rem;
  }

  #toggles-side {
    display: flex;
    flex-direction: column;
  }

  ncrs-tools-model-toggle {
    scale: 1.5;
    display: block;
  }

  ncrs-tools-editor-toggles {
    scale: 1.5;
    display: block;
  }

  .menu-arrow {
    display: block;
    position: absolute;
    bottom: 3.75rem;
  }

  .menu-arrow ncrs-icon {
    width: 2rem;
    height: 2rem;
  }

  .menu-arrow.menu-arrow-right {
    right: 0px;
  }

  .menu-arrow.menu-arrow-left {
    left: 0px;
  }

  #history button {
    all: unset;
    cursor: pointer;
  }

  #history button:first-child {
    margin-right: 0.25rem;
  }

  #history button:disabled {
    cursor: default;
  }

  #history button:focus-visible {
    outline: 1px solid white;
  }

  #history ncrs-icon {
    --icon-color: white;
    width: 2rem;
    height: 2rem;
  }

  #history button:disabled ncrs-icon {
    --icon-color: #aaaaaa;
  }

  #layers {
    display: flex;
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(0.32,0.72,0,1);
  }

  #layers.open {
    transform: translateX(0%);
  }

  #layers ncrs-layer-list {
    height: 100%;
  }

  #layers .toggle {
    position: absolute;
    align-self: center;
    display: block;
    width: 1.75rem;
    height: 5rem;
    left: -1.75rem;
    background-color: white;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    background-color: #1f2025;
    box-shadow: rgb(19, 19, 21) -2px 2px 4px;
  }

  #layers .toggle ncrs-icon {
    width: 1.5rem;
    height: 1.5rem;
    --icon-color: white;
  }

  #layers.open .toggle ncrs-icon {
    --icon-color: #55b2ff;
  }

  #layers:not(.open) .toggle > .on {
    display: none;
  }

  #layers.open .toggle > .off {
    display: none;
  }

`;

const DRAWER_OPEN_DRAG_THRESHOLD = 15;
const LAYERS_OPEN_DRAG_THRESHOLD = 5;

class MobileUI extends LitElement {
  static styles = [STYLES, COLOR_DRAWER_STYLES, CONFIG_DRAWER_STYLES];

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor;
    this.toolSet = new Toolset(this.editor);

    this.colorDrawer = new ColorDrawer(this);
    this.configDrawer = new ConfigDrawer(this);
    this.partToggles = new PartToggles(this.editor);
    this.modelToggle = new ModelToggle(this.editor);
    this.editorToggles = new EditorToggles(this.editor);

    this.layers = new LayerList(this);
    this.layers.mobile = true;

    this._pwaCheck();

    this.addEventListener("dblclick", event => event.preventDefault());
  }

  firstUpdated() {
    this.colorDrawer.firstUpdated();
    this.configDrawer.firstUpdated();

    this._setupButtonDrag();
    this._setupEvents();
  }

  render() {
    const eyedropper = this.editor.config.get("pick-color", false);

    return html`
      <div id="main">
        <div id="top">
          <div class="left">
            <ncrs-toggle id="fullscreenToggle" @click=${this._toggleFullscreen}>
              <ncrs-icon slot="off" icon="fullscreen" title="Switch to fullscreen." color="var(--icon-color)"></ncrs-icon>
              <ncrs-icon slot="on" icon="minimize" title="Switch to minimized." color="var(--icon-color)"></ncrs-icon>
            </ncrs-toggle>
          </div>
          <div class="right">
            ${this._historyButtons()}
          </div>
        </div>
        <div id="editor">
          ${this.editor}
          <div id="layers">
            ${this.layers}
            <button class="toggle" @click=${this._toggleLayers}>
              <ncrs-icon icon="arrow-right" class="on" color="var(--icon-color)"></ncrs-icon>
              <ncrs-icon icon="arrow-left" class="off" color="var(--icon-color)"></ncrs-icon>
            </button>
          </div>
        </div>
        <div id="bottom">
          <div id="menu">
            <div id="toolbar">
              ${this.toolSet}
            </div>
            <div class="container">
              <button id="config-button" class="side-button" @click=${this._showConfigDrawer} title="Open config drawer">
                <ncrs-icon icon="menu" color="var(--icon-color)"></ncrs-icon>
              </button>
              <div id="color-button-rainbow">
                <button id="color-button" @click=${this._showColorDrawer} title="Open color drawer"></button>
              </div>
              <ncrs-toggle ?toggled=${eyedropper} @click=${this._toggleEyedropper} class="side-button side-right">
                <ncrs-icon slot="off" icon="eyedropper" color="var(--icon-color)"></ncrs-icon>
                <ncrs-icon slot="on" icon="eyedropper" color="var(--icon-color-active)"></ncrs-icon>
              </ncrs-toggle>
            </div>
            <button class="menu-arrow menu-arrow-right" @click=${this._scrollToToggles}>
              <ncrs-icon icon="arrow-right" color="rgba(255, 255, 255, 0.2)"></ncrs-icon>
            </button>
          </div>
          <div id="toggles" class="container">
            <button class="menu-arrow menu-arrow-left" @click=${this._scrollToMenu}>
              <ncrs-icon icon="arrow-left" color="rgba(255, 255, 255, 0.2)"></ncrs-icon>
            </button>
            ${this.modelToggle}
            <div id="part-toggles">
              ${this.partToggles}
            </div>
            <div id="toggles-side">
              ${this.editorToggles}
            </div>
          </div>
        </div>
        ${this.colorDrawer.render()}
        ${this.configDrawer.render()}
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

  _showColorDrawer() {
    this.colorDrawer.show();
  }

  _showConfigDrawer() {
    this.configDrawer.show();
  }

  _scrollToToggles() {
    this.shadowRoot.getElementById("toggles").scrollIntoView({behavior: "smooth"});
  }

  _scrollToMenu() {
    this.shadowRoot.getElementById("menu").scrollIntoView({behavior: "smooth"});
  }

  _setupButtonDrag() {
    const colorButton = this.renderRoot.getElementById("color-button");
    this._setupDrawerOpenDrag(colorButton, this._showColorDrawer.bind(this));

    const configButton = this.renderRoot.getElementById("config-button");
    this._setupDrawerOpenDrag(configButton, this._showConfigDrawer.bind(this));

    this._setupLayersOpenDrag();
  }

  _toggleEyedropper() {
    this.colorDrawer.toggleEyedropper();
  }

  _toggleFullscreen() {
    this.classList.toggle("fullscreen");
  }

  _toggleLayers() {
    this.renderRoot.getElementById("layers").classList.toggle("open");
  }

  _setupDrawerOpenDrag(button, func) {
    interact(button).draggable({
      lockAxis: "y",
      listeners: {
        move: event => {
          if (event.dy < -DRAWER_OPEN_DRAG_THRESHOLD) {
            func();
          }
        }
      }
    });
  }

  _setupLayersOpenDrag() {
    const layers = this.renderRoot.getElementById("layers");
    const toggle = layers.querySelector(".toggle");

    
    interact(toggle).draggable({
      lockAxis: "x",
      listeners: {
        move: event => {
          event.preventDefault();

          const isOpen = layers.classList.contains("open");

          if (isOpen && event.dx > LAYERS_OPEN_DRAG_THRESHOLD) {
            this._toggleLayers();
          } else if (!isOpen && event.dx < -LAYERS_OPEN_DRAG_THRESHOLD) {
            this._toggleLayers();
          }
        }
      }
    });
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

  _pwaCheck() {
    if (window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches) {
      this.classList.add("fullscreen", "hide-controls");
    }
  }

  _setupEvents() {
    this.editor.config.addEventListener("pick-color-change", () => {
      this.requestUpdate();
    })

    this.editor.history.addEventListener("update", () => {
      this.requestUpdate();
    })
  }
}

customElements.define("ncrs-ui-mobile", MobileUI);
export default MobileUI;