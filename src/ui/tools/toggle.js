import { css, html, LitElement } from "lit";

class RenderToggle extends LitElement {
  static styles = css`
  :host {
    cursor: pointer;
    user-select: none;
    color: white;
  }
  ncrs-icon {
    width: 20px;
    height: 20px;
    display: inline-block
  }
`;

  static properties = {
    active: {},
    icon: {},
  }

  constructor(icon, callback) {
    super()
    this.active = true;
    this.icon = icon;
    this.callback = callback;
  }

  render() {
    return html`
      <div @click="${this.toggle}">
        <ncrs-icon icon="${this.icon}" color="white"></ncrs-icon>
        <ncrs-icon icon="${this.active ? "box-checked" : "box-unchecked"}" color="white"></ncrs-icon>
      </div>
    `
  }

  toggle() {
    this.active = !this.active;
    if (typeof this.callback == "function") {
      this.callback(this.active);
    }
  }
}

customElements.define("ncrs-render-toggle", RenderToggle);

export default RenderToggle;