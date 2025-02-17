import { css, html, LitElement } from "lit";

class Button extends LitElement {
  static styles = css`
    :host {
      --text-color: white;
      --text-color-hover: #ccc;
      --text-color-active: #aaa;
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
      background-image: linear-gradient(to top, #24272a, #313436);
      box-shadow: #3d4042 0px 0px 0px 2px inset, #191a1c 0px 1px 3px, #1f2226 0px 4px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
      box-sizing: border-box;

      margin-bottom: 0.375rem;
      color: var(--text-color);
    }

    button:hover {
      --text-color: var(--text-color-hover);
      box-shadow: #505254 0px 0px 0px 2px inset, #191a1c 0px 0px 3px, #272a2d 0px 4px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
    }

    button:active {
      --text-color: var(--text-color-active);
      background-image: linear-gradient(to top, #313436, #24272a);
      box-shadow: #3d4042 0px 0px 0px 2px inset, #191a1c 0px 0px 2px, #1f2226 0px 2px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
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