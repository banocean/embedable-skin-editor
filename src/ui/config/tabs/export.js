import Tab from "../../misc/tab";
import { css, html } from "lit";

class ExportTab extends Tab {
  static styles = [
    Tab.styles,
    css`
      p {
        margin: 0px;
      }
    `
  ]

  constructor() {
    super({name: "Export"})
  }

  render() {
    return html`<p>Export</p>`
  }
}

customElements.define("ncrs-export-tab", ExportTab);

export default ExportTab;