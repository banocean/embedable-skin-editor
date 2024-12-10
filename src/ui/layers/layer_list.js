import { Sortable } from "@shopify/draggable";
import { css, LitElement } from "lit";
import IconButton from "../misc/icon_button";
import NCRSEditor from "../../main";
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
      gap: 0.25rem;
      height: 100%;
    }

    #layers {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      flex-grow: 1;
      gap: 0.25rem;
    }

    #buttons {
      display: flex;
      gap: 0.125rem;
    }

    ncrs-icon-button {
      --icon-height: 1rem;
      flex-grow: 1;
    }

    ncrs-icon-button[icon="plus"] {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0px;
    }

    ncrs-icon-button[icon="trash"] {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.5rem;
    }
  `

  constructor() {
    super();
    this.sortable = new Sortable(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    NCRSEditor.layers.addEventListener("layers-update", () => {
      this.requestUpdate();
    })
  }

  render() {
    const div = document.createElement("div");
    div.id = "list";

    const layersDiv = this._setupLayers();
    div.appendChild(layersDiv);

    const buttonDiv = this._setupLayerButtons();
    div.appendChild(buttonDiv);

    return div;
  }

  _setupLayers() {
    const div = document.createElement("div");
    div.id = "layers";

    NCRSEditor.forEachLayer((layer, index) => {
      const uiLayer = new Layer(layer);

      div.prepend(uiLayer);
    })

    return div;
  }

  _setupLayerButtons() {
    const div = document.createElement("div");
    div.id = "buttons";

    div.appendChild(
      new IconButton("plus", () => {
        NCRSEditor.addLayer();
      })
    );

    div.appendChild(
      new IconButton("trash", () => {
        NCRSEditor.removeLayer();
      })
    );

    return div;
  }
}

customElements.define("ncrs-layer-list", LayerList);

export default LayerList;