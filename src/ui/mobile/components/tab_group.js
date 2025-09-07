import { entries } from "idb-keyval";
import { css, html, LitElement } from "lit";

class MobileTabGroup extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #nav {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: 0.25rem;
      width: max-content;
      margin: 0.25rem;
      margin-left: auto;
      margin-right: auto;
      background-color: #131315;
      padding: 0.25rem;
      border-radius: 0.25rem;
    }

    #nav button {
      all: unset;
      display: block;
      cursor: pointer;
      color: rgb(204, 204, 204);
      text-align: center;
      padding: 0.125rem 0.25rem;
      font-size: medium;
    }

    #nav button.selected {
      background-color: #1a1a1a;
      border-radius: 0.25rem;
      color: white;
    }

    #body {
      position: relative;
      display: flex;
      gap: 0.25rem;
      height: 100%;
      overflow-x: scroll;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
      scroll-snap-stop: always;
    }

    #body::-webkit-scrollbar {
        display: none;
    }

    ::slotted(ncrs-mobile-tab) {
      scroll-snap-align: start;
      min-width: 100%;
      max-width: 100%;
      max-height: 100%;
      overflow: auto;
    }
  `;

  constructor() {
    super();

    this.tabs = this._getChildTabs();
    this._setupMutationObserver();
  }
  selectedTab;
  
  render() {
    return html`
      <div id="nav">
        ${this._renderTabButtons()}
      </div>
      <div id="body">
        <slot></slot>
      </div>
    `;
  }

  _renderTabButtons() {
    return this._getChildTabs().map(tab => {
      const button = document.createElement("button");
      button.textContent = tab.name;

      button.addEventListener("click", () => {
        tab.scrollIntoView({behavior: "smooth"});
      });
      this._setupIntersectionObserver(tab, entries => {
        const entry = entries[0];
        entry.isIntersecting ? button.classList.add("selected") : button.classList.remove("selected");
      });

      return button;
    })
  }

  _getChildTabs() {
    return Array.from(this.querySelectorAll(":scope > ncrs-mobile-tab"));
  }

  _setupMutationObserver() {
    const mutationObserver = new MutationObserver((_mutationList, _observer) => {
      this.requestUpdate();
    });

    mutationObserver.observe(this, {childList: true});
  }

  _setupIntersectionObserver(tab, callback) {
    const intersectionObserver = new IntersectionObserver((entries, _observer) => {
      callback(entries);
    }, {threshold: 0.5})

    intersectionObserver.observe(tab);
  }
}

customElements.define("ncrs-mobile-tab-group", MobileTabGroup);
export default MobileTabGroup;