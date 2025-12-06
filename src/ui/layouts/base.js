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
    if (this.classList.contains("minimized")) {
      this.classList.replace("minimized", "fullscreen");
    } else if (this.classList.contains("fullscreen")) {
      this.classList.replace("fullscreen", "minimized");
    }

    this.ui.toggleFullscreen();
  }
}

export default BaseLayout;