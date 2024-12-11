import { css, html, LitElement } from "lit";
import NCRSEditor from "../../main";

class Tool extends LitElement {
  static styles = css`
  :host {
    --icon-color: white;

    display: block;
    cursor: pointer;
    user-select: none;
    margin-bottom: 0.375rem;
    border-radius: 0.25rem;
    border-width: 1px;
    border-color: #232428;
    border-bottom-color: #1e2326;
    background-image: linear-gradient(to top, #313436, #3f4244);
    box-shadow: inset 0 0 0 1px #ffffff0d,0 2px #262a2e,0 4px #1f2326,0 4px 3px #0003;
  }

  :host(:hover) {
    --icon-color: #f5f8cc;
  }

  :host([active=true]), :host(:active) {
    --icon-color: #aaaaaa;
    margin-top: 0.125rem;
    margin-bottom: 0.25rem;
    box-shadow: inset 0 0 0 1px #ffffff0d,0 2px #262a2e,0 2px #1f2326,0 1px 1px #0003;
  }

  button {
    all: unset;
    display: block;
    width: 100%;
    padding: 0.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    box-sizing: border-box;
  }

  ncrs-icon {
    height: 1.75rem;
    width: auto;
    display: block;
  }
`;

  static properties = {
    active: {reflect: true},
  }

  constructor(tool) {
    super()
    this.active = false;
    this.tool = tool;
  }

  render() {
    this.active = (NCRSEditor.currentTool == this.tool);

    const properties = this.tool.properties;

    const icon = properties.icon;
    const title = properties.name + "\n" + properties.description;

    return html`
      <button title="${title}" @click="${this.select}">
        <ncrs-icon icon="${icon}" color="var(--icon-color)"></ncrs-icon>
      </button>
    `
  }

  select() {
    this.active = true;
    NCRSEditor.selectTool(this.tool);
  }
}

customElements.define("ncrs-tool", Tool);

export default Tool;