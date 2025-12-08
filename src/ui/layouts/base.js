import { LitElement } from "lit";

class BaseLayout extends LitElement {
  constructor(ui, id) {
    super();

    this.ui = ui;
    this.id = id;
    this.persistence = this.ui.persistence;
    this.editor = this.ui.editor;

    this.classList.add("minimized");
  }

  toggleFullscreen() {
    this.ui.toggleFullscreen();
  }

  toggleEditorBackground() {
    this.ui.toggleEditorBackground();
  }
}

export default BaseLayout;