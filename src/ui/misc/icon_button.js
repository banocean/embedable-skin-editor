import { css, html, LitElement } from "lit";

class IconButton extends LitElement {
  static styles = css`
      :host {
      --icon-color: white;
      --icon-height: 1.75rem;

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
      height: var(--icon-height);
      width: auto;
      display: block;
    }
  `

  static properties = {
    icon: {reflect: true},
  }

  constructor(icon, callback) {
    super();

    this.icon = icon;
    this.callback = callback;
  }

  render() {
    return html`<button @click="${this.callback}"><ncrs-icon icon=${this.icon} color="var(--icon-color)"></ncrs-icon></button>`
  }
}

customElements.define("ncrs-icon-button", IconButton);

export default IconButton;