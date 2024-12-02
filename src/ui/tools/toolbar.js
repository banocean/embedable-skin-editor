import { css, html, LitElement } from "lit";
import RenderToggle from "./toggle";
import NCRSEditor from "../../editor";

class Toolbar extends LitElement {
  static styles = css`
  :host {
    display: block;
    height: 100%;
    padding: 0.25rem;
    width: 56px;
    background-color: #131315;
  }
`;

  constructor() {
    super();
  }

  render() {
    const div = document.createElement("div");

    div.appendChild(
      new RenderToggle("armor", active => {
        NCRSEditor.setOverlayVisible(active);
      })
    )

    div.appendChild(
      new RenderToggle("player", active => {
        NCRSEditor.setBaseVisible(active);
      })
    )

    div.appendChild(
      new RenderToggle("grid", active => {
        NCRSEditor.setGridVisible(active);
      })
    )

    return div;
  }
}

customElements.define("ncrs-toolbar", Toolbar);