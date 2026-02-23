import { getFocusedElement, isKeybindIgnored } from "../helpers";

// All keybind definitions, ^ = ctrl, + = shift, ! = alt
const KEYBINDS = {
  "b": "pen",
  "e": "eraser",
  "g": "bucket",
  "s": "shade",
  "i": "eyedropper",
  "+s": "sculpt",
  "^z": "undo",
  "^y": "redo",
  "^+z": "redo",
  "^r": "reset",
  "=": "zoomIn",
  "-": "zoomOut",
  "arrowleft": "panLeft",
  "arrowright": "panRight",
  "arrowup": "panUp",
  "arrowdown": "panDown",
  "0": "cameraReset",
  "1": "selectTools",
  "2": "selectLayer",
  "3": "selectImport",
  "4": "selectExport",
  "!t": "selectTools",
  "!l": "selectLayer",
  "!i": "selectImport",
  "!e": "selectExport",
  "+n": "addLayer",
  "delete": "removeLayer",
  "+d": "cloneLayer",
  "+m": "mergeLayer",
  "f": "toggleFullscreen",
  "+l": "toggleOverlay",
  "^+l": "toggleBase",
  "+o": "toggleOverlayGrid",
  "^+o": "toggleBaseGrid",
  "+f": "toggleBackfaceCulling",
  "^+f": "toggleGridCulling",
}

function checkKeybinds(event) {
    let key = '';
    if (event.ctrlKey) {
      key+='^';
    }
    if (event.altKey) {
      key+='!';
    }
    if (event.shiftKey) {
      key+='+';
    }
    key+=event.key.toLowerCase();

    if (key in KEYBINDS) {
      return KEYBINDS[key];
    }
  }

function setupKeybinds(ui, editor) {
  document.addEventListener("keydown", event => {
    if (ui.disableKeybinds) {
      return;
    }

    const element = event.originalTarget || getFocusedElement();

    if (isKeybindIgnored(element)) { return; }

    switch(checkKeybinds(event)) {
      case "eyedropper":
        editor.config.set("pick-color-toggle", true);
        editor.config.set("pick-color", !editor.config.get("pick-color", false));
        break;
      case "undo":
        editor.history.undo();
        break;
      case "redo":
        editor.history.redo();
        break;
      case "zoomIn":
        if (editor.camera.position.z > 1) {
          editor.camera.position.z-= editor.camera.position.z * 0.075;
        }
        break;
      case "zoomOut":
        if (editor.camera.position.z < 15) {
          editor.camera.position.z+= editor.camera.position.z * 0.075;
        }
        break;
      case "cameraReset":
        editor.resetCamera();
        break;
      }
  });
}

export default setupKeybinds;
