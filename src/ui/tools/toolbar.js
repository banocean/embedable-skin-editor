import { css, LitElement } from "lit";
import RenderToggle from "./toggle";
import Tool from "./tool";

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
  #tools {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

  constructor(ui) {
    super();

    this.ui = ui;
  }

  render() {
    this._setupEvents();

    const div = document.createElement("div");
    div.id = "toolbar";

    div.appendChild(this._renderTools());
    div.appendChild(this._renderToggles());

    return div;
  }

  select(tool) {
    this.shadowRoot.querySelectorAll("ncrs-tool").forEach(element => {
      element.active = (tool == element.tool);
    })
  }

  _setupEvents() {
    this.ui.editor.addEventListener("select-tool", event => {
      this.select(event.detail.tool);
    });
  }

  _renderTools() {
    const div = document.createElement("div");
    div.id = "tools";

    this.ui.editor.tools.forEach(tool => {
      div.appendChild(
        new Tool(this.ui, tool)
      )
    });

    return div;
  }

  _renderToggles() {
    const div = document.createElement("div");

    div.appendChild(
      new RenderToggle("armor", active => {
        this.ui.editor.setOverlayVisible(active);
      })
    )

    div.appendChild(
      new RenderToggle("player", active => {
        this.ui.editor.setBaseVisible(active);
      })
    )

    div.appendChild(
      new RenderToggle("grid", active => {
        this.ui.editor.setGridVisible(active);
      })
    )

    return div;
  }
}

customElements.define("ncrs-toolbar", Toolbar);

export default Toolbar;