import { css, html, LitElement } from "lit";

class Tool extends LitElement {
  static styles = css`
    :host(:active) ncrs-button::part(button), :host([active=true]) ncrs-button::part(button) {
      --text-color: var(--text-color-active);
      box-shadow: inset 0 0 0 1px #ffffff0d,0 2px #262a2e,0 2px #1f2326,0 1px 1px #0003;
      margin-top: 0.125rem;
      margin-bottom: 0.25rem;
    }

    ncrs-button::part(button) {
      padding: 0.25rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
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

  constructor(ui, tool) {
    super()
    this.active = false;
    this.ui = ui;
    this.tool = tool;
  }

  render() {
    this.active = (this.ui.editor.currentTool == this.tool);

    const properties = this.tool.properties;

    const icon = properties.icon;
    const title = properties.name + "\n" + properties.description;

    return html`
      <ncrs-button title="${title}" @click=${this.select}>
        <ncrs-icon icon="${icon}" color="var(--text-color)"></ncrs-icon>
      </ncrs-button>
    `
  }

  select() {
    this.active = true;
    this.ui.editor.selectTool(this.tool);
  }
}

customElements.define("ncrs-tool", Tool);

export default Tool;