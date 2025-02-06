import { css, html, LitElement } from "lit";

class Button extends LitElement {
  static styles = css`
    :host {
      --text-color: white;
      --text-color-hover: #f5f8cc;
      --text-color-active: #aaaaaa;
      display: block;
      color: var(--text-color);
    }

    button:hover {
      color: var(--text-color-hover);
    }

    button:active {
      color: var(--text-color-active);
      box-shadow: inset 0 0 0 1px #ffffff0d,0 2px #262a2e,0 2px #1f2326,0 1px 1px #0003;
      margin-top: 0.125rem;
      margin-bottom: 0.25rem;
    }

    button:focus-visible {
      outline: 1px white solid;
    }

    button {
      all: unset;
      display: block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      user-select: none;
      border-radius: 0.25rem;
      border-width: 1px;
      border-color: #232428;
      border-bottom-color: #1e2326;
      background-image: linear-gradient(to top, #313436, #3f4244);
      box-shadow: inset 0 0 0 1px #ffffff0d,0 2px #262a2e,0 4px #1f2326,0 4px 3px #0003;

      margin-bottom: 0.375rem;
    }
  `

  render() {
    return html`
      <button part="button">
        <slot></slot>
      </button>
    `
  }
}

customElements.define("ncrs-button", Button);

export default Button;