import { css, html, LitElement } from "lit";
const ICON_PATH = "/images/icons/";

class Icon extends LitElement {
  constructor() {
    super();
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    div {
      width: 100%;
      height: 100%;
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }
  `;

  static properties = {
    icon: {},
    color: {},
  }

  render() {
    return html`
      <div style="mask-image: url('${ICON_PATH}${this.icon}.svg'); background-color: ${this.color};"></div>
    `
  }
}

customElements.define("ncrs-icon", Icon);

export default Icon;