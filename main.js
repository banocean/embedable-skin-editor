import "./style.css"
import "./src/editor/main"
import "./src/ui/main"

const editor = document.getElementById("editor");

document.addEventListener("keypress", event => {
  if (event.key == "z") {
    editor.history.undo();
  }

  if (event.key == "y") {
    editor.history.redo();
  }
})