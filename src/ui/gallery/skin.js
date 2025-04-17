import { css, html, LitElement } from "lit";

class GallerySkin extends LitElement {
  static styles = css`
    button {
      all: unset;
      display: block;
      cursor: pointer;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  `;

  constructor(metadata = {}) {
    super();
    
    this.metadata = metadata;
  }

  render() {
    const meta = this.metadata;

    return html`
      <button @click=${this._addSkin} title="Add skin to project">
        <ncrs-skin-2d src=${meta.image} variant=${meta.model}></ncrs-skin-2d>
      </button>
    `
  }

  _addSkin() {
    console.log(this.metadata);
    this.dispatchEvent(new CustomEvent("add-skin", {detail: this.metadata}));
  }
}

customElements.define("ncrs-gallery-skin", GallerySkin);

export default GallerySkin;