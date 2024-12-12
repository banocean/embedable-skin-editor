import "./misc/icon"

import { css, html, LitElement } from "lit";
import { Editor } from "../editor/main";
import Toolbar from "./tools/toolbar";
import LayerList from "./layers/layer_list";

class UI extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();

    this.editor = new Editor;
    this.toolbar = new Toolbar(this);
    this.layers = new LayerList(this);
  }

  firstUpdated() {
    document.addEventListener("keypress", event => {
      if (event.key == "z") {
        this.editor.history.undo();
      }
    
      if (event.key == "y") {
        this.editor.history.redo();
      }
    })
  }

  render() {
    return html`
      ${this.toolbar}
      ${this.editor}
      ${this.layers}
    `;
  }
}

customElements.define("ncrs-ui", UI);

export default UI;