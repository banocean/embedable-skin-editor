import Tab from "../../misc/tab";
import { css, html } from "lit";

class ImportTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      #main {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      #buttons {
        display: flex;
        flex-direction: column;
        flex-basis: 0;
        padding: 0.5rem;
        background-color: #1A1A1A;
      }

      #buttons ncrs-button {
        text-align: center;
        font-size: large;
        font-weight: bold;
      }

      #buttons ncrs-button::part(button) {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }

      #spacer {
        flex-grow: 1;
      }

      hr {
        width: 100%;
        border-color: #494C4E;
        margin-bottom: 0.75rem;
        box-sizing: border-box;
      }

      input {
        font-size: medium;
        margin-bottom: 0.25rem;
      }

      #import-username {
        position: relative;
      }

      #import-username:after {
        --height: 10px;
        content: "";
        width: 0;
        height: 0;
        border-left: var(--height) solid transparent;
        border-right: var(--height) solid transparent;
        border-top: var(--height) solid #ffffff;
        position: absolute;
        z-index: 99;
        left: 50%;
        top: -5px;
        margin-left: calc(var(--height) * -1);
      }
    `
  ]

  constructor() {
    super({name: "Project"});
    this.fileInput = document.createElement("input");
  }

  render() {
    return html`
      <div id="main">
        <div id="buttons">
          <ncrs-button title="Import a skin file as a new layer.">Import Skin from File</ncrs-button>
          <ncrs-button title="Import a .ncrs project file.">Import Project from File</ncrs-button>
          <hr>
          <input id="username" type="text" placeholder="Steve">
          <ncrs-button id="import-username">Import Skin from Username</ncrs-button>
        </div>
        <div id="spacer"></div>
      </div>
    `
  }
}

customElements.define("ncrs-import-tab", ImportTab);

export default ImportTab;