import { Sortable } from "sortablejs";
import { css, html, LitElement } from "lit";
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
      display: grid;
      grid-template-columns: 1fr 1fr;
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
      flex-grow: 1;
    }

    ncrs-button::part(button) {
      padding: 0.125rem;
      padding-top: 0.42rem;
      padding-bottom: 0.42rem;
    }

    #add-button, #remove-button {
      margin-bottom: -0.25rem;
    }

    #clone-button::part(button) {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0px;
    }

    #merge-button::part(button) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.5rem;
    }

    ncrs-icon {
      display: block;
      box-sizing: border-box;
      height: 0.8rem;
      width: auto;
    }

    :host(.mobile) {
      width: 6rem;
    }

    :host(.mobile) #layers-wrapper {
      width: 5.5rem;
    }

    :host(.mobile) ncrs-layer {
      width: 5.25rem;
      --icon-size: 1.5rem;
    }
  `;

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
    });

    this.ui.editor.layers.addEventListener("layers-select", () => {
      this.requestUpdate();
    });
  }

  render() {
    const layersDiv = this._setupLayers();
    const mergeDisabled = this.ui.editor.layers.selectedLayerIndex == 0;

    return html`
      <div id="list">
        ${layersDiv}
        <div id="buttons">
          <ncrs-button id="add-button" @click=${this._addLayer} title="Add layer [Shift+N]">
            <ncrs-icon part="icon" icon="add" color="var(--text-color)"></ncrs-icon>
          </ncrs-button>
          <ncrs-button id="remove-button" @click=${this._removeLayer} title="Remove current layer [Del]">
            <ncrs-icon part="icon" icon="remove" color="var(--text-color)"></ncrs-icon>
          </ncrs-button>
          <ncrs-button id="clone-button" @click=${this._cloneLayer} title="Clone current layer [Shift+D]">
            <ncrs-icon part="icon" icon="clone" color="var(--text-color)"></ncrs-icon>
          </ncrs-button>
          <ncrs-button id="merge-button" @click=${this._mergeLayer} title="Merge current layer with below [Shift+M]" ?disabled=${mergeDisabled}>
            <ncrs-icon part="icon" icon="merge" color="var(--text-color)"></ncrs-icon>
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

  _addLayer() {
    this.ui.editor.addLayer();
  }

  _removeLayer() {
    this.ui.editor.removeLayer();
  }

  _cloneLayer() {
    this.ui.editor.cloneLayer();
  }

  _mergeLayer() {
    this.ui.editor.mergeLayer();
  }
}

customElements.define("ncrs-layer-list", LayerList);

export default LayerList;