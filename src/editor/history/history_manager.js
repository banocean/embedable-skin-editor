class HistoryManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  add(entry, shadow = false) {
    entry.shadow = shadow;

    if (entry.perform()) {
      this.undoStack.push(entry);
      this.redoStack = [];
      return true;
    }

    return false;
  }

  undo() {
    if (this.undoStack.length < 1) {
      return false;
    }

    const entry = this.undoStack.pop();
    entry.revert();
    this.redoStack.push(entry);

    if (entry.shadow) {
      this.undo();
    }

    return true;
  }

  redo() {
    if (this.redoStack.length < 1) {
      return false;
    }

    const entry = this.redoStack.pop();
    entry.perform();
    this.undoStack.push(entry);

    if (entry.shadow) {
      this.redo();
    }

    return true;
  }
}

export { HistoryManager };
