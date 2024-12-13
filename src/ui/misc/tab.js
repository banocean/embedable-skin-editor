import { css, LitElement } from "lit";

class Tab extends LitElement {
  static styles = css`
    :host {
      display: none;
    }

    :host([visible=true]) {
      display: block;
    }
  `;

  static properties = {
    visible: {reflect: true}
  }

  constructor(properties = {}) {
    super();

    this.properties = properties;
    this.visible = false;
  }

  render() {}
}

export default Tab;