import { css, html, LitElement } from "lit";

class Button extends LitElement {
  static styles = css`
    :host {
      --text-color: white;
      --text-color-hover: #f5f8cc;
      --text-color-active: #aaaaaa;
      display: block;
    }

    button {
      all: unset;
      display: block;
      width: 100%;
      height: auto;
      cursor: pointer;
      user-select: none;
      border-radius: 0.25rem;
      border-width: 1px;
      border-color: rgb(35, 36, 40) rgb(35, 36, 40) rgb(30, 35, 38);
      background-image: linear-gradient(to top, rgb(49, 52, 54), rgb(63, 66, 68));
      box-shadow: rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset, rgb(38, 42, 46) 0px 2px, rgb(31, 35, 38) 0px 4px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
      box-sizing: border-box;

      margin-bottom: 0.375rem;
      color: var(--text-color);
    }

    button:hover {
      --text-color: var(--text-color-hover);
    }

    button:active {
      --text-color: var(--text-color-active);
      box-shadow: inset 0 0 0 1px #ffffff0d,0 2px #262a2e,0 2px #1f2326,0 1px 1px #0003;
      margin-top: 0.125rem;
      margin-bottom: 0.25rem;
    }

    button:focus-visible {
      outline: 1px white solid;
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