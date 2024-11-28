import "./style.css"
import "./src/editor/main"

const editor = document.getElementById("editor");

function setupToggle(id, callback) {
  const element = document.getElementById(id);
  element.addEventListener("change", callback);
}

let baseVisible = true;
let overlayVisible = true;
let gridVisible = true;

const baseGrid = editor.model.baseGrid;
const overlayGrid = editor.model.overlayGrid;

function setBaseVisible(visible) {
  baseVisible = visible;
  this.updateVisibility();
}

function setOverlayVisible(visible) {
  overlayVisible = visible;
  updateVisibility();
}

function setGridVisible(visible) {
  gridVisible = visible;
  updateVisibility();
}

function updateVisibility() {
  if (baseVisible) {
    editor.camera.layers.enable(1);
  } else {
    editor.camera.layers.disable(1);
  }

  if (overlayVisible) {
    editor.camera.layers.enable(2);
  } else {
    editor.camera.layers.disable(2);
  }

  baseGrid.visible =
    gridVisible && baseVisible && !overlayVisible;
  overlayGrid.visible = gridVisible && overlayVisible;
}

setupToggle("overlayToggle", event => {
  setOverlayVisible(event.target.checked);
})

setupToggle("baseToggle", event => {
  setBaseVisible(event.target.checked);
})

setupToggle("gridToggle", event => {
  setGridVisible(event.target.checked);
})

setOverlayVisible(true);

document.addEventListener("keypress", event => {
  if (event.key == "z") {
    editor.history.undo();
  }

  if (event.key == "y") {
    editor.history.redo();
  }
})