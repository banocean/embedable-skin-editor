import "./misc/icon"
import "./misc/button"
import "./misc/toggle";

import { css, html, LitElement } from "lit";
import { Editor } from "../editor/main";
import Toolbar from "./tools/toolbar";
import LayerList from "./layers/layer_list";
import Config from "./config/main";
import PersistenceManager from "../persistence";
import { getFocusedElement } from "../helpers";

class UI extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    :host > div {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
    }

    #filters-warning {
      display: none;
      position: absolute;
      top: 8px;
      left: 64px;
      color: #aaaaaa;
      font-size: small;
    }

    #filters-warning svg {
      width: 1.25rem;
      height: auto;
    }

    :host(.has-filters) #filters-warning {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      pointer-events: none;
    }

    ncrs-editor {
      background-color: #191919;
      background-image: url("/images/grid-editor-dark.png");
      flex-grow: 1;
    }
  `;

  constructor() {
    super();

    this.persistence = new PersistenceManager("ncrs-ui");
    this.editor = new Editor;
    this.toolbar = new Toolbar(this);
    this.layers = new LayerList(this);
    this.config = new Config(this);

    this._setupEvents();
  }
  currentLayer;

  firstUpdated() {
    const ignoredElements = ["TEXTAREA", "INPUT", "SELECT"];

    document.addEventListener("keydown", event => {
      const element = event.originalTarget || getFocusedElement();

      if (ignoredElements.includes(element.nodeName)) { return; }

      if (event.key == "z") {
        this.editor.history.undo();
      }
    
      if (event.key == "y") {
        this.editor.history.redo();
      }

      if (event.key == "x" && event.ctrlKey) {
        this.editor.persistence.reset();
        this.persistence.reset();
        location.reload();
      }
    })
  }

  render() {
    return html`
      <div>
        ${this.toolbar}
        ${this.editor}
        ${this.layers}
        ${this.config}
        <div id="filters-warning">
          <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          Colors drawn on the current layer will be altered by filters.
        </div>
      </div>
      <slot name="footer"></slot>
    `;
  }

  _setupEvents() {
    const layers = this.editor.layers;
    layers.addEventListener("layers-select", () => {
      const layer = layers.getSelectedLayer();
      layer.hasFilters() ? this.classList.add("has-filters") : this.classList.remove("has-filters");
    });

    layers.addEventListener("update-filters", () => {
      const layer = layers.getSelectedLayer();
      layer.hasFilters() ? this.classList.add("has-filters") : this.classList.remove("has-filters");
    });
  }
}

customElements.define("ncrs-ui", UI);

export default UI;