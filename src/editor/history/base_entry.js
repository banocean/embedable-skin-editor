class BaseEntry {
  hasPerformed = false;
  shadow = false;

  perform() {
    if (this.hasPerformed) { return false; }

    this.onPerform();
    this.hasPerformed = true;
    return true;
  }

  revert() {
    if (!this.hasPerformed) { return false; }

    this.onRevert();
    this.hasPerformed = false;
    return true;
  }

  onPerform() {}
  onRevert() {}
}

export { BaseEntry }