class HistoryManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  add(entry) {
    const lastEntry = this.undoStack.at(-1);
    if (lastEntry?.stacking && lastEntry.constructor == entry.constructor) {
      return lastEntry.onStack(entry);
    } else if (entry.perform()) {
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

    return true;
  }

  redo() {
    if (this.redoStack.length < 1) {
      return false;
    }

    const entry = this.redoStack.pop();
    entry.perform();
    this.undoStack.push(entry);

    return true;
  }
}

export { HistoryManager };
