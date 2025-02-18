import { Sortable } from "sortablejs";
import { css, html, LitElement } from "lit";
import IconButton from "../misc/icon_button";
import Layer from "./layer";

class LayerList extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 5rem;
      background-color: rgb(19, 19, 21);
      box-sizing: border-box;
      padding: 0.25rem;
    }

    #list {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      height: 100%;
    }

    #layers-wrapper {
      position: relative;
      flex-grow: 1;
      width: 72px;
      overflow: auto;
    }

    #layers-overflow {
      position: absolute;
      display: flex;
      flex-direction: column;

      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }

    #layers-spacer {
      flex-grow: 1;
    }

    #layers {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow: auto;
      overflow-x: hidden;
      scrollbar-width: none;
    }

    #buttons {
      display: flex;
      gap: 0.125rem;
      width: 100%;
    }

    ncrs-layer {
      flex-shrink: 0;
    }

    ncrs-layer.sortable-chosen {
      cursor: grabbing;
    }

    ncrs-button {
      --icon-height: 1rem;
      flex-grow: 1;
    }

    ncrs-button::part(button) {
      padding: 0.25rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    #plus-button::part(button) {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0px;
    }

    #trash-button::part(button) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.5rem;
    }

    ncrs-icon {
      display: block;
      box-sizing: border-box;
      height: 1rem;
      width: auto;
    }
  `

  constructor(ui) {
    super();
    this.ui = ui;
  }
  sortable;

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    this.ui.editor.layers.addEventListener("layers-update", () => {
      this.requestUpdate();
    })
  }

  render() {
    const layersDiv = this._setupLayers();
    const buttonDiv = this._setupLayerButtons();

    return html`
      <div id="list">
        ${layersDiv}
        <div id="buttons">
          <ncrs-button id="plus-button" @click=${this._addLayer}>
            <ncrs-icon part="icon" icon="plus" color="var(--text-color)"></ncrs-icon>
          </ncrs-button>
          <ncrs-button id="trash-button" @click=${this._removeLayer}>
            <ncrs-icon part="icon" icon="trash" color="var(--text-color)"></ncrs-icon>
          </ncrs-button>
        </div>
      </div>
    `;
  }

  _setupLayers() {
    const inner = document.createElement("div");
    inner.id = "layers"

    this.sortable = this._setupSortable(inner);

    this.ui.editor.forEachLayer((layer) => {
      inner.prepend(new Layer(this.ui, layer));
    })

    return html`
      <div id="layers-wrapper">
        <div id="layers-overflow">
          <div id="layers-spacer"></div>
          ${inner}
        </div>
      </div>
    `;
  }

  _setupSortable(target) {
    const sortable = new Sortable(target, {
      draggable: "ncrs-layer",
      distance: 2,
      onEnd: (event) => {
        const count = target.querySelectorAll("ncrs-layer").length - 1;

        const fromIndex = count - event.oldDraggableIndex;
        const toIndex = count - event.newDraggableIndex;

        this.ui.editor.reorderLayers(fromIndex, toIndex);
      }
    });

    return sortable;
  }

  _setupLayerButtons() {
    const div = document.createElement("div");
    div.id = "buttons";

    div.appendChild(
      new IconButton("plus", () => {
        this.ui.editor.addLayer();
      })
    );

    div.appendChild(
      new IconButton("trash", () => {
        this.ui.editor.removeLayer();
      })
    );

    return div;
  }

  _addLayer() {
    this.ui.editor.addLayer();
  }

  _removeLayer() {
    this.ui.editor.removeLayer();
  }
}

customElements.define("ncrs-layer-list", LayerList);

export default LayerList;