import { del } from "idb-keyval";
import { getFocusedElement, isKeybindIgnored } from "../helpers";
import PersistenceManager from "../persistence";

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

function setupKeybinds(editor, config) {
  document.addEventListener("keydown", event => {
    const element = event.originalTarget || getFocusedElement();
    if (isKeybindIgnored(element)) { return; }

    switch(checkKeybinds(event)) {
      case "pen":
        if (editor.currentTool == editor.tools[0]) {
          config.select("tool");
        }
        editor.selectTool(editor.tools[0]);
        break;
      case "eraser":
        if (editor.currentTool == editor.tools[1]) {
          config.select("tool");
        }
        editor.selectTool(editor.tools[1]);
        break;
      case "bucket":
        if (editor.currentTool == editor.tools[2]) {
          config.select("tool");
        }
        editor.selectTool(editor.tools[2]);
        break;
      case "shade":
        if (editor.currentTool == editor.tools[3]) {
          config.select("tool");
        }
        editor.selectTool(editor.tools[3]);
        break;
      case "sculpt":
        if (!editor.config.get("overlayVisible")) { break; }
        if (editor.currentTool == editor.tools[4]) {
          config.select("tool");
        }
        editor.selectTool(editor.tools[4]);
        break;
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
      case "reset":
        const check = confirm("Do you want to reset all editor data? You will lose all progress on your current skin.");

        if (check) {
          PersistenceManager.resetAll();
          del("ncrs:reference-images");
          location.reload();
        }
        
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
      case "selectTools":
        config.select("tool");
        break;
      case "selectLayer":
        config.select("layers");
        break;
      case "selectImport":
        config.select("import");
        break;
      case "selectExport":
        config.select("export");
        break;
      case "addLayer":
        editor.addLayer();
        break;
      case "removeLayer":
        editor.removeLayer();
        break;
      case "cloneLayer":
        editor.cloneLayer();
        break;
      case "mergeLayer":
        editor.mergeLayer();
        break;
      case "toggleFullscreen":
        this.toggleFullscreen();
        break;
      }
  });
}

export default setupKeybinds;