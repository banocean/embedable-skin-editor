import "./style.css"
import "./src/renderer/main"

const editor = document.getElementById("editor");

function setupToggle(id, callback) {
  const element = document.getElementById(id);
  element.addEventListener("change", callback);
}

setupToggle("overlayToggle", event => {
  editor.model.setOverlayVisible(event.target.checked);
})

setupToggle("baseToggle", event => {
  editor.model.setBaseVisible(event.target.checked);
})

setupToggle("gridToggle", event => {
  editor.model.setGridVisible(event.target.checked);
})

document.addEventListener("keypress", event => {
  if (event.key == "z") {
    editor.history.undo();
  }

  if (event.key == "y") {
    editor.history.redo();
  }
})