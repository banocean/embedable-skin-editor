import { css, html, LitElement, unsafeCSS } from "lit";
import PersistenceManager from "../../persistence";
import { Editor } from "../../main";
import "./components/drawer";
import "./components/tab";
import "./components/tab_group";
import "../misc/color_picker";

import imgGridDark from "/assets/images/grid-editor-dark.png";
import Toolset from "../tools/toolset";
import { ColorDrawer, COLOR_DRAWER_STYLES } from "./color_drawer";
import interact from "interactjs";
import PartToggles from "../tools/part_toggles";
import ModelToggle from "../tools/model_toggle";
import EditorToggles from "../tools/editor_toggles";

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
  }

  #editor ncrs-editor {
    width: 100%;
    height: 100%;
    min-width: 240px;
  }

  #top {
    width: 100%;
    height: 3.375rem;
    background-color: #1f2025;
  }

  ncrs-tools-toolset {
    --ncrs-icon-height: 1.25rem;

    display: block;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    background-color: #0A0A0D;
  }

  ncrs-tools-toolset::part(tool) {
    flex-grow: 1;
  }

  #bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 6.875rem;
    background-color: #1f2025;
    padding: 0rem 2.5rem;
    box-sizing: border-box;
  }

  #color-button-rainbow {
    border-radius: 9999px;
    padding: 0.125rem;
    background-image: conic-gradient(in lch longer hue,red 0 100%);
  }
  
  #color-button {
    all: unset;
    display: block;
    cursor: pointer;
    border-radius: 9999px;
    width: 4rem;
    height: 4rem;
    background: linear-gradient(var(--current-color), var(--current-color)),
      repeating-conic-gradient(#aaa 0% 25%, #888 0% 50%) 50%/ 8px 8px;
    border: 4px solid rgb(31, 32, 37);
  }

  .side-button {
    all: unset;
    display: block;
    cursor: pointer;
  }

  .side-button ncrs-icon {
    width: 3rem;
    height: 3rem;
    --icon-color: white;
  }

  #toggles-drawer {
    --base-opacity: 0.25;
    --base-blur: 1px;
    --drawer-height: 23rem;
  }
  
  #toggles-drawer::part(body) {
    padding: 0.5rem;
  }

  ncrs-tools-part-toggles {
    --scale: 1.5;
  }

  #toggles {
    display: flex;
    gap: 4rem;
    justify-content: center;
    padding-top: 3.5rem;
  }

  #toggles-side {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin-top: 0.75rem;
  }

  ncrs-tools-model-toggle, ncrs-tools-editor-toggles {
    scale: 1.5;
    display: block;
  }
`;

const DRAWER_OPEN_DRAG_THRESHOLD = 15;

class MobileUI extends LitElement {
  static styles = [STYLES, COLOR_DRAWER_STYLES];

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor;
    this.toolSet = new Toolset(this.editor);

    this.colorDrawer = new ColorDrawer(this);
    this.partToggles = new PartToggles(this.editor);
    this.modelToggle = new ModelToggle(this.editor);
    this.editorToggles = new EditorToggles(this.editor);

    this.addEventListener("dblclick", event => event.preventDefault());
  }

  firstUpdated() {
    this.colorDrawer.firstUpdated();

    this._setupButtonDrag();
  }

  render() {
    return html`
      <div id="main">
        <div id="top"></div>
        <div id="editor">
          ${this.editor}
        </div>
        <div id="toolbar">
          ${this.toolSet}
        </div>
        <div id="bottom">
          <button class="side-button">
            <ncrs-icon icon="menu" color="var(--icon-color)"></ncrs-icon>
          </button>
          <div id="color-button-rainbow">
            <button id="color-button" @click=${this._showColorDrawer} title="Open color drawer"></button>
          </div>
          <button id="toggles-button" @click=${this._showTogglesDrawer} class="side-button">
            <ncrs-icon icon="base" color="var(--icon-color)"></ncrs-icon>
          </button>
        </div>
        ${this.colorDrawer.render()}
        <ncrs-mobile-drawer id="toggles-drawer">
          <div id="toggles">
            <div>
              ${this.partToggles}
            </div>
            <div id="toggles-side">
              ${this.modelToggle}
              ${this.editorToggles}
            </div>
          </div>
        </ncrs-mobile-drawer>
      </div>
      <slot name="footer"></slot>
    `;
  }

  _showColorDrawer() {
    this.colorDrawer.show();
  }

  _showTogglesDrawer() {
    this.shadowRoot.getElementById("toggles-drawer").show();
  }

  _setupButtonDrag() {
    const colorButton = this.renderRoot.getElementById("color-button");
    this._setupDrawerOpenDrag(colorButton, this._showColorDrawer.bind(this));

    const togglesButton = this.renderRoot.getElementById("toggles-button");
    this._setupDrawerOpenDrag(togglesButton, this._showTogglesDrawer.bind(this));
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
}

customElements.define("ncrs-ui-mobile", MobileUI);
export default MobileUI;