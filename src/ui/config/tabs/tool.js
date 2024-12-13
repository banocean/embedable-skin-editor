import Tab from "../../misc/tab";
import { css, html } from "lit";

class ToolTab extends Tab {
  static styles = [
    Tab.styles,
    css``
  ]

  constructor() {
    super({name: "Tools"})
  }

  render() {
    return html`<p>Hello, World!</p>`
  }
}

customElements.define("ncrs-tool-tab", ToolTab);

export default ToolTab;