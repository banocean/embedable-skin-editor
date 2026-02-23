import BaseLayout from "./base";

import { css, html, unsafeCSS } from "lit";

import imgGridDark from "../../../assets/images/grid-editor-dark.png";

class NCRSUIDesktopLayout extends BaseLayout {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      --ncrs-color-picker-height: 15rem;
    }

    #main {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
    }

    ncrs-warning-manager {
      position: absolute;
      top: 8px;
      left: 4px;
      padding-right: 2.5rem;
      --text-color: var(--editor-icon-color);
    }

    :host(.minimized) {
      --ncrs-color-picker-height: 15rem;
    }

    :host(.fullscreen) {
      --ncrs-color-picker-height: 17rem;
    }

    #editor {
      background-color: #191919;
      background-image: var(--editor-bg, url(${unsafeCSS(imgGridDark)}));
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

    #themeToggle {
      all: unset;
      display: block;
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
    }

    #themeToggle ncrs-icon {
      width: 24px;
      height: 24px;
    }

    #themeToggle .dark {
      display: var(--toggle-dark);
    }

    #themeToggle .gray {
      display: var(--toggle-gray);
    }

    #themeToggle .light {
      display: var(--toggle-light);
    }

    #fullscreenToggle {
      all: unset;
      display: block;
      cursor: pointer;
      position: absolute;
      top: 40px;
      right: 8px;
    }

    #fullscreenToggle ncrs-icon {
      width: 24px;
      height: 24px;
    }

    #fullscreenToggle .minimize {
      display: var(--toggle-minimize);
    }

    #fullscreenToggle .fullscreen {
      display: var(--toggle-fullscreen);
    }
  `;

  constructor(ui) {
    super(ui, "desktop");

    this._setupEvents();
  }

  firstUpdated() {
    super.firstUpdated();
  }

  render() {
    return html`
      <div id="main">
        <div id="editor">
          ${this.editor}
          ${this.warningManager}
        </div>
        <div id="layers"></div>
      </div>
    `;
  }

  _setupEvents() {
    this.editor.history.addEventListener("update", () => {
      this.requestUpdate();
    });
  }
}

customElements.define("ncrs-ui-desktop-layout", NCRSUIDesktopLayout);

export default NCRSUIDesktopLayout;
