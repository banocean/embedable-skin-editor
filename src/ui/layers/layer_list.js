import { Sortable } from "@shopify/draggable";
import { css, LitElement } from "lit";
import IconButton from "../misc/icon_button";
import NCRSEditor from "../../main";
import AddLayerEntry from "../../editor/history/entries/add_layer_entry";
import DeleteLayerEntry from "../../editor/history/entries/delete_layer_entry";
import SelectLayerEntry from "../../editor/history/entries/select_layer_entry";

class LayerList extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 5rem;
      background-color: rgb(19, 19, 21);
      box-sizing: border-box;
    }

    #buttons {
      display: flex;
    }

    ncrs-icon-button {
      --icon-height: 1rem;
      flex-grow: 1;
    }

    ncrs-icon-button[icon="plus"] {
      border-bottom-left-radius: 0.75rem;
      border-bottom-right-radius: 0px;
    }

    ncrs-icon-button[icon="trash"] {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.75rem;
    }
  `

  constructor() {
    super();

    this.sortable = new Sortable(this);
  }

  render() {
    const div = document.createElement("div");

    const buttonDiv = this._setupLayerButtons();
    div.appendChild(buttonDiv);

    return div;
  }

  _setupLayerButtons() {
    const div = document.createElement("div");
    div.id = "buttons";

    const layers = NCRSEditor.layers;
    const history = NCRSEditor.history;

    div.appendChild(
      new IconButton("plus", () => {
        history.add(
          new AddLayerEntry(layers, {layer: layers.createBlank()})
        )
        history.add(
          new SelectLayerEntry(layers, layers.getLayerAtIndex(layers.layers.length - 1))
        )
      })
    );

    div.appendChild(
      new IconButton("trash", () => {
        history.add(
          new DeleteLayerEntry(layers, layers.getSelectedLayer())
        )
      })
    );

    return div;
  }
}

customElements.define("ncrs-layer-list", LayerList);

export default LayerList;