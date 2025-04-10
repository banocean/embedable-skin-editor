import * as THREE from "three";
import AddLayerEntry from "../../../editor/history/entries/add_layer_entry";
import Tab from "../../misc/tab";
import { css, html } from "lit";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../../../editor/main";
import createReferenceImage from "./import/reference_image";
import ProjectLoader from "../../../editor/format/project_loader";

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

      .hidden {
        display: none;
      }
    `
  ]

  constructor(editor) {
    super({name: "Project"});
    this.editor = editor;
    this.pngFileInput = this._createFileInput();
    this.ncrsFileInput = this._createFileInput();
    this.referenceFileInput = this._createFileInput();

    this.pngFileInput.addEventListener("change", this._pngFileRead.bind(this));
    this.pngFileInput.accept = "image/png";

    this.ncrsFileInput.accept = ".ncrs"
    this.ncrsFileInput.addEventListener("change", this._ncrsFileRead.bind(this));
    
    this.referenceFileInput.accept = "image/*";
    this.referenceFileInput.addEventListener("change", this._referenceFileRead.bind(this));
  }

  render() {
    return html`
      <div id="main">
        <div id="buttons">
          ${this.pngFileInput}
          ${this.ncrsFileInput}
          ${this.referenceFileInput}
          <input id="username" type="text" placeholder="Steve">
          <ncrs-button id="import-username">Import Skin from Username</ncrs-button>
          <hr>
          <ncrs-button @click=${this.pngOpen} title="Import a skin file as a new layer.">Import Skin from File</ncrs-button>
          <ncrs-button @click=${this.ncrsOpen} title="Import a .ncrs project file.">Import Project from File</ncrs-button>
          <hr>
          <ncrs-button @click=${this.referenceImageOpen} title="Add a reference image.">Add Reference Image</ncrs-button>
        </div>
        <div id="spacer"></div>
      </div>
    `
  }

  pngOpen() {
    this.pngFileInput.value = null;
    this.pngFileInput.click();
  }

  ncrsOpen() {
    this.ncrsFileInput.value = null;
    this.ncrsFileInput.click();
  }

  referenceImageOpen() {
    this.referenceFileInput.value = null;
    this.referenceFileInput.click();
  }

  _pngFileRead(event) {
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

  _ncrsFileRead(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const json = JSON.parse(text);

      const projectLoader = new ProjectLoader(json);
      projectLoader.load(this.editor);
    }

    reader.readAsText(file);
  }

  _referenceFileRead(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        document.body.appendChild(
          createReferenceImage(this.editor, img)
        );
      }

      img.src = reader.result;
    }

    reader.readAsDataURL(file);
  }

  _createFileInput() {
    const input = document.createElement("input");
    input.classList.add("hidden");
    input.type = "file";

    return input;
  }
}

customElements.define("ncrs-import-tab", ImportTab);

export default ImportTab;