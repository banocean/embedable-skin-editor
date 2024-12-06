import "./editor/main"
import "./ui/main"

const NCRSEditor = document.getElementById("editor");

document.addEventListener("keypress", event => {
  if (event.key == "z") {
    NCRSEditor.history.undo();
  }

  if (event.key == "y") {
    NCRSEditor.history.redo();
  }
})

window.NCRSEditor = NCRSEditor;

export default NCRSEditor;