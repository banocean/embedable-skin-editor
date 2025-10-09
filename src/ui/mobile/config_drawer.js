import { css } from "lit";
import MobileDrawer from "./components/drawer";
import MobileTabGroup from "./components/tab_group";
import MobileTab from "./components/tab";
import LayersTabFilters from "../config/tabs/layers/filters";
import LayersTabButtons from "../config/tabs/layers/buttons";
import ImportTabButtons from "../config/tabs/import/buttons";
import ExportTabButtons from "../config/tabs/export/buttons";

const CONFIG_DRAWER_STYLES = css`
  ncrs-layers-tab-filters {
    --ncrs-slider-height: 1.25rem;
    --ncrs-slider-input-width: 3rem;
  }

  #config-drawer ncrs-import-tab-buttons::part(reference-image) {
    display: none;
  }
`;

class ConfigDrawer {
  constructor(ui) {
    this.ui = ui;
    this.editor = this.ui.editor;

    this.drawer = this._setupMobileDrawer();
  }

  firstUpdated() {}

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

    tabGroup.appendChild(this._createFiltersTab());
    tabGroup.appendChild(this._createLayerTab());
    tabGroup.appendChild(this._createImportTab());
    tabGroup.appendChild(this._createExportTab());

    drawer.appendChild(tabGroup);

    return drawer;
  }

  _createFiltersTab() {
    const tab = new MobileTab();
    tab.name = "Filters";

    const filters = new LayersTabFilters(this.editor);
    tab.appendChild(filters);

    return tab;
  }

  _createLayerTab() {
    const tab = new MobileTab();
    tab.name = "Layer";

    const buttons = new LayersTabButtons(this.editor);
    tab.appendChild(buttons);

    return tab;
  }

  _createImportTab() {
    const tab = new MobileTab();
    tab.name = "Import";

    const buttons = new ImportTabButtons(this.ui, this.editor);
    tab.appendChild(buttons);

    return tab;
  }
  
  _createExportTab() {
    const tab = new MobileTab();
    tab.name = "Export";

    const buttons = new ExportTabButtons(this.ui, this.editor);
    buttons.mobile = true;

    tab.appendChild(buttons);
    tab.selected = true;

    return tab;
  }
}

export {ConfigDrawer, CONFIG_DRAWER_STYLES};