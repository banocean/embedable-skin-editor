import { css, html, LitElement } from "lit";
const ICON_PATH = "/images/icons/";

import imgIconOverlay from "/assets/images/icons/toggles/overlay.svg";
import imgIconBackfaceCulling from "/assets/images/icons/toggles/backface-culling.svg";
import imgIconBlowUpModel from "/assets/images/icons/toggles/blow-up-model.svg";
import imgIconBoxChecked from "/assets/images/icons/box-checked.svg";
import imgIconBoxHalfChecked from "/assets/images/icons/box-half-checked.svg";
import imgIconBoxInnerChecked from "/assets/images/icons/box-inner-checked.svg";
import imgIconBoxOuterChecked from "/assets/images/icons/box-outer-checked.svg";
import imgIconBoxUnchecked from "/assets/images/icons/box-unchecked.svg";
import imgIconBrush from "/assets/images/icons/tools/brush.svg";
import imgIconBucket from "/assets/images/icons/tools/bucket.svg";
import imgIconCgol from "/assets/images/icons/cgol.svg";
import imgIconCamo from "/assets/images/icons/modifiers/camo.svg";
import imgIconCircle from "/assets/images/icons/modifiers/circle.svg";
import imgIconClone from "/assets/images/icons/misc/clone.svg";
import imgIconContiguous from "/assets/images/icons/modifiers/contiguous.svg";
import imgIconCopy from "/assets/images/icons/misc/copy.svg";
import imgIconDownload from "/assets/images/icons/download.svg";
import imgIconEraser from "/assets/images/icons/tools/eraser.svg";
import imgIconEyeClosed from "/assets/images/icons/toggles/eye-closed.svg";
import imgIconEyedropper from "/assets/images/icons/tools/eyedropper.svg";
import imgIconEyeOpen from "/assets/images/icons/toggles/eye-open.svg";
import imgIconForce1 from "/assets/images/icons/modifiers/force-1.svg";
import imgIconForce2 from "/assets/images/icons/modifiers/force-2.svg";
import imgIconForce3 from "/assets/images/icons/modifiers/force-3.svg";
import imgIconForce4 from "/assets/images/icons/modifiers/force-4.svg";
import imgIconForce5 from "/assets/images/icons/modifiers/force-5.svg";
import imgIconSize1 from "/assets/images/icons/modifiers/size-1.svg";
import imgIconSize2 from "/assets/images/icons/modifiers/size-2.svg";
import imgIconSize3 from "/assets/images/icons/modifiers/size-3.svg";
import imgIconOverlayGrid from "/assets/images/icons/toggles/overlay-grid.svg";
import imgIconBaseGrid from "/assets/images/icons/toggles/base-grid.svg";
import imgIconJitter from "/assets/images/icons/jitter.svg";
import imgIconShadeOnce from "/assets/images/icons/modifiers/shade-once.svg";
import imgIconMerge from "/assets/images/icons/misc/merge.svg";
import imgIconBlend from "/assets/images/icons/modifiers/blend.svg";
import imgIconSaturate from "/assets/images/icons/modifiers/saturate.svg";
import imgIconPaste from "/assets/images/icons/misc/paste.svg";
import imgIconBase from "/assets/images/icons/toggles/base.svg";
import imgIconAdd from "/assets/images/icons/misc/add.svg";
import imgIconRedo from "/assets/images/icons/misc/redo.svg";
import imgIconSculpt from "/assets/images/icons/tools/sculpt.svg";
import imgIconSearch from "/assets/images/icons/misc/search.svg";
import imgIconShade from "/assets/images/icons/toggles/shade.svg";
import imgIconShading from "/assets/images/icons/tools/shading.svg";
import imgIconMirror from "/assets/images/icons/modifiers/mirror.svg";
import imgIconSquare from "/assets/images/icons/modifiers/square.svg";
import imgIconRemove from "/assets/images/icons/misc/remove.svg";
import imgIconUndo from "/assets/images/icons/misc/undo.svg";
import imgIconLightMode from "/assets/images/icons/misc/light-mode.svg";
import imgIconLighten from "/assets/images/icons/modifiers/lighten.svg";
import imgIconDuskMode from "/assets/images/icons/misc/dusk-mode.svg";
import imgIconDarkMode from "/assets/images/icons/misc/dark-mode.svg";


const ICON_MAP = {
  "overlay": imgIconOverlay,
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
  "camo": imgIconCamo,
  "circle": imgIconCircle,
  "clone": imgIconClone,
  "contiguous": imgIconContiguous,
  "copy": imgIconCopy,
  "download": imgIconDownload,
  "eraser": imgIconEraser,
  "eye-closed": imgIconEyeClosed,
  "eyedropper": imgIconEyedropper,
  "eye-open": imgIconEyeOpen,
  "force-1": imgIconForce1,
  "force-2": imgIconForce2,
  "force-3": imgIconForce3,
  "force-4": imgIconForce4,
  "force-5": imgIconForce5,
  "size-1": imgIconSize1,
  "size-2": imgIconSize2,
  "size-3": imgIconSize3,
  "overlay-grid": imgIconOverlayGrid,
  "base-grid": imgIconBaseGrid,
  "jitter": imgIconJitter,
  "shade-once": imgIconShadeOnce,
  "merge": imgIconMerge,
  "blend": imgIconBlend,
  "saturate": imgIconSaturate,
  "paste": imgIconPaste,
  "base": imgIconBase,
  "add": imgIconAdd,
  "redo": imgIconRedo,
  "sculpt": imgIconSculpt,
  "search": imgIconSearch,
  "shade": imgIconShade,
  "shading": imgIconShading,
  "mirror": imgIconMirror,
  "square": imgIconSquare,
  "remove": imgIconRemove,
  "undo": imgIconUndo,
  "light-mode": imgIconLightMode,
  "lighten": imgIconLighten,
  "dusk-mode": imgIconDuskMode,
  "dark-mode": imgIconDarkMode,
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

      /* Old webkit browsers */
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
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