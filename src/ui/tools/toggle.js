import { css, html, LitElement } from "lit";

class RenderToggle extends LitElement {
  static styles = css`
  :host {
    cursor: pointer;
    user-select: none;
    color: white;
    white-space: nowrap;
  }

  button {
    all: unset;
    width: 100%;
    display: block;
  }

  button:focus-visible {
    outline: 1px white solid;
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
      <button @click="${this.toggle}">
        <ncrs-icon icon="${this.icon}" color="white"></ncrs-icon>
        <ncrs-icon icon="${this.active ? "box-checked" : "box-unchecked"}" color="white"></ncrs-icon>
      </button>
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