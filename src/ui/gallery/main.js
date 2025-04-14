import { css, html, LitElement } from "lit";

class Gallery extends LitElement {
  static properties = {
    url: {}
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;

      padding: 2rem;
      box-sizing: border-box;
      pointer-events: none;
    }

    #main {
      box-sizing: border-box;

      width: 100%;
      height: 100%;

      display: grid;
      grid-template-columns: 2fr 8fr;
      background-color: rgba(35, 36, 40, 0.75);

      pointer-events: all;
    }

    #filters {
      background-color: red;
    }
  `

  constructor(ui) {
    super();

    this.ui = ui;
    this.editor = this.ui.editor;
  }

  render() {
    return html`
      <div id="main">
        <div id="filters"></div>
        <div id="browse">
          <div id="tabs"></div>
          <div id="skins"></div>
          <div id="pagination"></div>
        </div>
      </div>
    `
  }
}

customElements.define("ncrs-gallery", Gallery);

export {Gallery};