import { css, html, LitElement } from "lit";
const ICON_PATH = "/images/icons/";

import imgIconArmor from "/assets/images/icons/armor.svg";
import imgIconBackfaceCulling from "/assets/images/icons/backface-culling.svg";
import imgIconBlowUpModel from "/assets/images/icons/blow-up-model.svg";
import imgIconBoxChecked from "/assets/images/icons/box-checked.svg";
import imgIconBoxHalfChecked from "/assets/images/icons/box-half-checked.svg";
import imgIconBoxInnerChecked from "/assets/images/icons/box-inner-checked.svg";
import imgIconBoxOuterChecked from "/assets/images/icons/box-outer-checked.svg";
import imgIconBoxUnchecked from "/assets/images/icons/box-unchecked.svg";
import imgIconBrush from "/assets/images/icons/brush.svg";
import imgIconBucket from "/assets/images/icons/bucket.svg";
import imgIconCgol from "/assets/images/icons/cgol.svg";
import imgIconChecker from "/assets/images/icons/checker.svg";
import imgIconCircle from "/assets/images/icons/circle.svg";
import imgIconClone from "/assets/images/icons/clone.svg";
import imgIconContiguous from "/assets/images/icons/contiguous.svg";
import imgIconCopy from "/assets/images/icons/copy.svg";
import imgIconDownload from "/assets/images/icons/download.svg";
import imgIconEraser from "/assets/images/icons/eraser.svg";
import imgIconEyeClosed from "/assets/images/icons/eye-closed.svg";
import imgIconEyedropper from "/assets/images/icons/eyedropper.svg";
import imgIconEyeOpen from "/assets/images/icons/eye-open.svg";
import imgIconForce_1 from "/assets/images/icons/force_1.svg";
import imgIconForce_2 from "/assets/images/icons/force_2.svg";
import imgIconForce_3 from "/assets/images/icons/force_3.svg";
import imgIconForce_4 from "/assets/images/icons/force_4.svg";
import imgIconForce_5 from "/assets/images/icons/force_5.svg";
import imgIconFoursquare from "/assets/images/icons/foursquare.svg";
import imgIconGrid from "/assets/images/icons/grid.svg";
import imgIconJitter from "/assets/images/icons/jitter.svg";
import imgIconMerge from "/assets/images/icons/merge.svg";
import imgIconPalette from "/assets/images/icons/palette.svg";
import imgIconPaste from "/assets/images/icons/paste.svg";
import imgIconPlayer from "/assets/images/icons/player.svg";
import imgIconPlus from "/assets/images/icons/plus.svg";
import imgIconRedo from "/assets/images/icons/redo.svg";
import imgIconSculpt from "/assets/images/icons/sculpt.svg";
import imgIconSearch from "/assets/images/icons/search.svg";
import imgIconShading from "/assets/images/icons/shading.svg";
import imgIconShield from "/assets/images/icons/shield.svg";
import imgIconSquare from "/assets/images/icons/square.svg";
import imgIconSun from "/assets/images/icons/sun.svg";
import imgIconTrash from "/assets/images/icons/trash.svg";
import imgIconUndo from "/assets/images/icons/undo.svg";

const ICON_MAP = {
  "armor": imgIconArmor,
  "backface-culling": imgIconBackfaceCulling,
  "blow-up-model": imgIconBlowUpModel,
  "box-checked": imgIconBoxChecked,
  "box-half-checked": imgIconBoxHalfChecked,
  "box-inner-checked": imgIconBoxInnerChecked,
  "box-outer-checked": imgIconBoxOuterChecked,
  "box-unchecked": imgIconBoxUnchecked,
  "brush": imgIconBrush,
  "bucket": imgIconBucket,
  "cgol": imgIconCgol,
  "checker": imgIconChecker,
  "circle": imgIconCircle,
  "clone": imgIconClone,
  "contiguous": imgIconContiguous,
  "copy": imgIconCopy,
  "download": imgIconDownload,
  "eraser": imgIconEraser,
  "eye-closed": imgIconEyeClosed,
  "eyedropper": imgIconEyedropper,
  "eye-open": imgIconEyeOpen,
  "force_1": imgIconForce_1,
  "force_2": imgIconForce_2,
  "force_3": imgIconForce_3,
  "force_4": imgIconForce_4,
  "force_5": imgIconForce_5,
  "foursquare": imgIconFoursquare,
  "grid": imgIconGrid,
  "jitter": imgIconJitter,
  "merge": imgIconMerge,
  "palette": imgIconPalette,
  "paste": imgIconPaste,
  "player": imgIconPlayer,
  "plus": imgIconPlus,
  "redo": imgIconRedo,
  "sculpt": imgIconSculpt,
  "search": imgIconSearch,
  "shading": imgIconShading,
  "shield": imgIconShield,
  "square": imgIconSquare,
  "sun": imgIconSun,
  "trash": imgIconTrash,
  "undo": imgIconUndo,
}

class Icon extends LitElement {
  constructor() {
    super();
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    div {
      width: 100%;
      height: 100%;
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }
  `;

  static properties = {
    icon: {},
    color: {},
  }

  render() {
    const div = document.createElement("div");
    div.style.maskImage = `url("${ICON_MAP[this.icon]}")`;
    div.style.backgroundColor = this.color;

    return div;
  }
}

customElements.define("ncrs-icon", Icon);

export default Icon;