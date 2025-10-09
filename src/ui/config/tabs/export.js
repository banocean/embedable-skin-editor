import Tab from "../../misc/tab";
import { css, html } from "lit";
import ExportTabButtons from "./export/buttons";

class ExportTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      #main {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      #form {
        flex-grow: 1;
      }
    `
  ]

  constructor(ui) {
    super({name: "Export", title: "Export [4]\nExport skins, project files, and share to gallery."});
    
    this.buttons = new ExportTabButtons(ui, ui.editor);
  }

  render() {
    return html`
      <div id="main">
        ${this.buttons}
        <div id="form"></div>
      </div>
    `;
  }
}

customElements.define("ncrs-export-tab", ExportTab);

export default ExportTab;