import { css, html, LitElement, unsafeCSS } from "lit";
import PersistenceManager from "../../persistence";
import { Editor } from "../../main";
import "./components/drawer";

import imgGridDark from "/assets/images/grid-editor-dark.png";
import Toolset from "../tools/toolset";

class MobileUI extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      -webkit-user-select: none;
      --editor-bg: url(${unsafeCSS(imgGridDark)});
      --ncrs-color-picker-height: 15rem;
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
      width: 100%;
      height: 6.875rem;
      background-color: #1f2025;
    }
  `;

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor;
    this.toolSet = new Toolset(this.editor);
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
        <div id="bottom"></div>
        <ncrs-mobile-drawer open>
          <span slot="header">Hello World</span>
        </ncrs-mobile-drawer>
      </div>
      <slot name="footer"></slot>
    `;
  }
}

customElements.define("ncrs-ui-mobile", MobileUI);
export default MobileUI;