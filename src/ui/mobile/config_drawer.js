import { css } from "lit";
import MobileDrawer from "./components/drawer";
import MobileTabGroup from "./components/tab_group";
import MobileTab from "./components/tab";
import LayersTabFilters from "../config/tabs/layers/filters";
import LayersTabButtons from "../config/tabs/layers/buttons";

const CONFIG_DRAWER_STYLES = css`
  ncrs-layers-tab-filters {
    --ncrs-slider-height: 1.25rem;
    --ncrs-slider-input-width: 2.25rem;
  }
`;

class ConfigDrawer {
  constructor(ui) {
    this.ui = ui;
    this.editor = this.ui.editor;

    this.drawer = this._setupMobileDrawer();
  }

  firstUpdated() {
  }

  render() {
    return this.drawer;
  }

  show() {
    this.drawer.show();
  }

  _setupMobileDrawer() {
    const drawer = new MobileDrawer();
    drawer.id = "config-drawer";

    const tabGroup = new MobileTabGroup();
    
    const filtersTab = new MobileTab();
    filtersTab.name = "Filters";
    const filters = new LayersTabFilters(this.editor);
    filtersTab.appendChild(filters);
    tabGroup.appendChild(filtersTab);

    const layersTab = new MobileTab();
    layersTab.name = "Layer";
    const buttons = new LayersTabButtons(this.editor);
    layersTab.appendChild(buttons);
    tabGroup.appendChild(layersTab);
    
    const importTab = new MobileTab();
    importTab.name = "Import";
    tabGroup.appendChild(importTab);

    const exportTab = new MobileTab();
    exportTab.name = "Export";
    tabGroup.appendChild(exportTab);

    drawer.appendChild(tabGroup);

    return drawer;
  }
}

export {ConfigDrawer, CONFIG_DRAWER_STYLES};