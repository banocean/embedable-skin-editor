import { css, html, LitElement } from "lit";
import PartToggles from "./part_toggles";

import EditorToggles from "./editor_toggles";
import ModelToggle from "./model_toggle";
import Toolset from "./toolset";

class Toolbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: auto;
      padding: 0.25rem;
      width: 3.75rem;
      background-color: #131315;
      box-sizing: border-box;
    }

    #toolbar {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.25rem;
    }

    ncrs-tools-toolset {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .hidden {
      display: none;
    }

    ncrs-tools-part-toggles {
      margin-bottom: 1rem;
    }
  `;

  constructor(ui) {
    super();

    this.ui = ui;
    this.toolSet = new Toolset(this.ui);
    this.partToggles = new PartToggles(this.ui.editor);
    this.modelToggle = new ModelToggle(this.ui);
    this.editorToggles = new EditorToggles(this.ui);
  }

  render() {
    return html`
      <div id="toolbar">
        ${this.toolSet}
        <div>
          ${this.partToggles}
          ${this.modelToggle}
          ${this.editorToggles}
        </div>
      </div>
    `;
  }
}

customElements.define("ncrs-toolbar", Toolbar);

export default Toolbar;