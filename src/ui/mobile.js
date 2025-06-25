import { css, html } from "lit";

function mobileStyle() {
  return css`
    :host {
      min-width: 370px;
      max-width: 100vw;
      max-height: 100vh;
      position: fixed;
    }

    #history {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      justify-content: center;
      padding: 0rem;
      gap: 0.5rem;
      background-color: transparent;
    }

    #drawer {
      display: none;
      justify-content: flex-end;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(4px);
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }

    :host(.drawerOpen) #drawer {
      display: flex;
    }

    #drawerToggle {
      position: absolute;
      display: flex;
      align-items: center;
      top: 0px;
      bottom: 0px;
      right: 0px;
    }

    #drawerToggle ncrs-toggle {
      color: white;
      font-size: xx-large;
      background-color: #1F2025;
      padding: 1rem 0.25rem;
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }

    #drawerToggle p {
      margin: 0px;
    }
  `
}

function mobileLayout(ui) {
  function toggleDrawer() {
    ui.classList.toggle("drawerOpen");
  }

  return html`
    <div id="main">
      ${ui.toolbar}
      <div id="editor">
        ${ui.editor}
        ${ui._filtersWarning()}
        ${ui._bgToggle()}
        ${ui._fullscreenToggle()}
        ${ui._historyButtons()}
      </div>
      <div id="drawer">
        ${ui.config}
        <div id="layers">
          ${ui.layers}
        </div>
      </div>
      <div id="drawerToggle">
        <ncrs-toggle @toggle=${toggleDrawer}>
          <p slot="on">></p>
          <p slot="off"><</p>
        </ncrs-toggle>
      </div>
      ${ui._setupColorCheckModal()}
    </div>
    ${ui.exportModal}
    ${ui.galleryModal}
    <slot name="footer"></slot>
  `;
}

export {mobileLayout, mobileStyle};