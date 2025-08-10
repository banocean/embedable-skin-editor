import { css, html, LitElement, unsafeCSS } from "lit";
import PersistenceManager from "../../persistence";
import { Editor } from "../../main";
import "./components/drawer";
import "../misc/color_picker";

import imgGridDark from "/assets/images/grid-editor-dark.png";
import Toolset from "../tools/toolset";
import { ColorDrawer, COLOR_DRAWER_STYLES } from "./color_drawer";

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
    justify-content: center;
    width: 100%;
    height: 6.875rem;
    background-color: #1f2025;
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
    background-color: var(--current-color);
    border: 4px solid rgb(31, 32, 37);
  }
`;

class MobileUI extends LitElement {
  static styles = [STYLES, COLOR_DRAWER_STYLES];

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor;
    this.toolSet = new Toolset(this.editor);

    this.colorDrawer = new ColorDrawer(this);
  }

  firstUpdated() {
    this.colorDrawer.firstUpdated();
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
          <div id="color-button-rainbow">
            <button id="color-button" @click=${this._showColorDrawer} title="Open color drawer"></button>
          </div>
        </div>
        ${this.colorDrawer.render()}
      </div>
      <slot name="footer"></slot>
    `;
  }

  _showColorDrawer() {
    this.colorDrawer.show();
  }
}

customElements.define("ncrs-ui-mobile", MobileUI);
export default MobileUI;