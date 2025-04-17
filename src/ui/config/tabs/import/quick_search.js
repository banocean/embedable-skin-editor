import { css, html, LitElement } from "lit";
import { GALLERY_URL, IMAGE_HEIGHT, IMAGE_WIDTH } from "../../../../constants";
import GallerySkin from "../../../gallery/skin";
import { clamp } from "../../../../helpers";

class QuickSearch extends LitElement {
  static properties = {
    _galleryData: {state: true},
  }

  static styles = css`
    #main {
      display: flex;
      align-items: flex-start;
      gap: 0.25rem;
    }

    ncrs-icon {
      width: 20px;
      height: 20px;
    }

    #search-button::part(button) {
      padding: 0px;
    }

    input {
      flex-grow: 1;
      font-size: medium;
      box-sizing: border-box;
      color: white;
      background-color: #131315;
      border-style: solid;
      border-width: 0px;
      border-radius: 4px;
      box-shadow: 0 0 0 2px #313436;
      padding-left: 0.25rem;
    }

    #skins {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.25rem;
      padding: 0.5rem;
      background-color: #191919;
    }

    #nav {
      margin-top: 0.25rem;
      display: flex;
      justify-content: space-between;
    }

    #nav ncrs-button {
      font-size: large;
    }

    #nav ncrs-button::part(button) {
      padding: 0.125rem 0.75rem;
    }

    #nav ncrs-button:first-of-type::part(button) {
      border-bottom-left-radius: 0.5rem;
    }

    #nav ncrs-button:last-of-type::part(button) {
      border-bottom-right-radius: 0.5rem;
    }

    #nav span {
      color: white;
      font-weight: bold;
    }
  `;

  constructor(editor) {
    super();

    this.editor = editor;

    this.searchField = this._createSearchField();
    this.page = this.page || 1;
    this.seed = this._generateSeed();

    this._setupEvents();
  }
  query = "";
  page = 1;
  pageCount = 1;

  firstUpdated() {
    this._syncGalleryData();
  }

  render() {
    const skins = this._renderSkins();

    if (this._galleryData) {
      this.page = this._galleryData.page.current;
      this.pageCount = this._galleryData.page.total;
    }

    return html`
      <div id="main">
        ${this.searchField}
        <ncrs-button id="search-button" title="Submit search" @click=${this._setQuery}>
          <ncrs-icon icon="search" color="var(--text-color)"></ncrs-icon>
        </ncrs-button>
      </div>
      ${skins}
      <div id="nav">
        <ncrs-button @click=${this._navBack}>Back</ncrs-button>
        <span>${this.page} / ${this.pageCount}</span>
        <ncrs-button @click=${this._navNext}>Next</ncrs-button>
      </div>
    `;
  }

  _navBack() {
    this.page = clamp(this.page - 1, 1, this.pageCount);
    this._syncGalleryData();
  }

  _navNext() {
    this.page = clamp(this.page + 1, 1, this.pageCount);
    this._syncGalleryData();
  }

  _setQuery() {
    if (this.query == "" && this.searchField.value == "") {
      return;
    }

    this.query = this.searchField.value;
    this.page = 1;
    this._syncGalleryData();
  }

  _getURL() {
    const params = new URLSearchParams();
    params.set("items", 9);

    if (this.query && this.query != "") {
      params.set("search", this.query);
    } else {
      params.set("order", `random~${this.seed}`)
    }

    params.set("model", this.editor.config.get("variant", "classic"));

    return GALLERY_URL + `/${this.page}?${params}`;
  }

  _getGalleryData() {
    const headers = {
      "Accept": "application/json",
    }

    return fetch(this._getURL(), {headers});
  }

  _syncGalleryData() {
    this._getGalleryData().then(data => {
      data.json().then(json => {
        this._galleryData = json;
      });
    })
  }

  _renderSkins() {
    const div = document.createElement("div");
    div.id = "skins";

    if (!this._galleryData) { return div; }

    this._galleryData.skins.forEach(skin => {
      const gallerySkin = new GallerySkin(skin);
      gallerySkin.addEventListener("add-skin", event => {
        this._addSkin(event.detail);
      })

      div.appendChild(gallerySkin);
    });

    return div;
  }

  _addSkin(metadata) {
    const img = new Image();

    img.onload = () => {
      const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      this.editor.addCanvasLayer(canvas);
    }

    img.src = metadata.image;
  }

  _createSearchField() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search for parts";

    input.addEventListener("change", () => {
      this._setQuery();
    })

    return input;
  }

  _generateSeed() {
    const floatArray = new Float32Array(1);
    floatArray[0] = Math.random();

    const dv = new DataView(floatArray.buffer);
    
    const bytes = [
      dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3),
    ];

    const str = String.fromCharCode(...bytes);

    return btoa(str);
  }

  _setupEvents() {
    this.editor.config.addEventListener("variant-change", () => {
      this._syncGalleryData();
    })
  }
}

customElements.define("ncrs-quick-search", QuickSearch);

export default QuickSearch;