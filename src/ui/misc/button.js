import { css, html, LitElement, nothing } from "lit";

class Button extends LitElement {
  static styles = css`
    :host {
      --text-color: white;
      --text-color-hover: #ccc;
      --text-color-active: #aaa;
      --text-color-disabled: #838383;
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
      box-shadow: #3d4042 0px 0px 0px 1px inset, #191a1c 0px 1px 3px, #1f2226 0px 4px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
      box-sizing: border-box;

      margin-bottom: 0.375rem;
      color: var(--text-color);
    }

    button:hover:not(:disabled) {
      --text-color: var(--text-color-hover);
      box-shadow: #505254 0px 0px 0px 1px inset, #191a1c 0px 0px 3px, #272a2d 0px 4px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
    }

    button:active:not(:disabled), :host([active]) button {
      --text-color: var(--text-color-active);
      background-image: linear-gradient(to top, #313436, #24272a);
      box-shadow: #3d4042, #191a1c 0px 0px 2px, #1f2226 0px 2px, rgba(0, 0, 0, 0.2) 0px 4px 3px;
      margin-top: 0.125rem;
      margin-bottom: 0.25rem;
    }

    button:focus-visible {
      outline: 1px white solid;
    }

    button:disabled {
      --text-color: var(--text-color-disabled);
      margin-top: 0.0625rem;
      margin-bottom: 0.3125rem;
      cursor: initial
    }
  `

  static properties = {
    active: {type: Boolean, reflect: true},
    disabled: {type: Boolean, reflect: true},
  }

  render() {
    return html`
      <button part="button" ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `
  }
}

customElements.define("ncrs-button", Button);

export default Button;