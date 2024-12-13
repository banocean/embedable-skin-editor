import Tab from "../../misc/tab";
import { css, html } from "lit";

class LayersTab extends Tab {
  static styles = [
    Tab.styles,
    css``
  ]

  constructor() {
    super({name: "Layers"})
  }

  render() {
    return html`<p>Layers</p>`
  }
}

customElements.define("ncrs-layers-tab", LayersTab);

export default LayersTab;