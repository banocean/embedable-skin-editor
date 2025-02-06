import Tab from "../../misc/tab";
import { css, html } from "lit";

class ImportTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      p {
        margin: 0px;
      }
    `
  ]

  constructor() {
    super({name: "Import"})
  }

  render() {
    return html`<p>Import</p>`
  }
}

customElements.define("ncrs-import-tab", ImportTab);

export default ImportTab;