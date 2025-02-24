import { css, html, LitElement } from "lit";
import "./controls"
import TabGroup from "../misc/tab_group";
import ToolTab from "./tabs/tool";
import LayersTab from "./tabs/layers";
import ImportTab from "./tabs/import";
import ExportTab from "./tabs/export";

class Config extends LitElement {
  static styles = css`
    :host {
      width: 288px;
    }

    ncrs-tab-group {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #232428;
    }

    ncrs-tab-group::part(tabs) {
      flex-grow: 1;
      overflow: auto;
    }

    ncrs-tab-group::part(tab) {
      height: 100%;
    }

    ncrs-tab-group::part(buttons) {
      display: flex;
      gap: 0.25rem;
      background-color: #131315;
      padding-bottom: 0.25rem;
    }

    ncrs-tab-group::part(button) {
      all: unset;

      flex-grow: 1;
      display: block;
      cursor: pointer;
      text-align: center;
      color: white;
      user-select: none;
      padding: 0.25rem;
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      border-width: 0px;
      border-bottom-width: 2px;
      border-color: #232428;
      border-style: solid;
      background-color: #1a1a1a;
    }

    ncrs-tab-group::part(button):hover {
      color: #ccc;
    }

    ncrs-tab-group::part(button selected),
    ncrs-tab-group::part(button):active {
      border-color: #313436;
    }

    ncrs-tab-group::part(button selected) {
      background-color: #232428;
    }
  `

  constructor(ui) {
    super();

    this.ui = ui;
    this.editor = this.ui.editor;
  }

  render() {
    const tabs = new TabGroup();

    const toolTab = new ToolTab(this.ui);
    const layersTab = new LayersTab(this.editor);
    const importTab = new ImportTab();
    const exportTab = new ExportTab();

    tabs.registerTab(toolTab);
    tabs.registerTab(layersTab);
    tabs.registerTab(importTab);
    tabs.registerTab(exportTab);

    return tabs;
  }
}

customElements.define("ncrs-config", Config);

export default Config;