import * as THREE from "three";
import AddLayerEntry from "../../../editor/history/entries/add_layer_entry";
import Tab from "../../misc/tab";
import { css, html } from "lit";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../../../editor/main";

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

      #file-input {
        display: none;
      }
    `
  ]

  constructor(editor) {
    super({name: "Project"});
    this.editor = editor;
    this.fileInput = document.createElement("input");
    this.fileInput.id = "file-input";
    this.fileInput.type = "file";
    this.fileInput.addEventListener("change", this._fileRead.bind(this));
  }

  render() {
    return html`
      <div id="main">
        <div id="buttons">
          ${this.fileInput}
          <ncrs-button @click=${this.pngOpen} title="Import a skin file as a new layer.">Import Skin from File</ncrs-button>
          <ncrs-button title="Import a .ncrs project file.">Import Project from File</ncrs-button>
          <hr>
          <input id="username" type="text" placeholder="Steve">
          <ncrs-button id="import-username">Import Skin from Username</ncrs-button>
        </div>
        <div id="spacer"></div>
      </div>
    `
  }

  pngOpen() {
    this.fileInput.accept = "image/png";
    this.fileInput.click();
  }

  _fileRead(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        this.editor.history.add(
          new AddLayerEntry(this.editor.layers, {texture: new THREE.Texture(img, IMAGE_WIDTH, IMAGE_HEIGHT)})
        )
      }

      img.src = reader.result;
    }

    reader.readAsDataURL(file);
  }
}

customElements.define("ncrs-import-tab", ImportTab);

export default ImportTab;