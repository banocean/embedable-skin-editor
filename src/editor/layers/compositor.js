class Compositor extends EventTarget {
  _filters = [];

  getFilters() {
    return this._filters;
  }

  applyFilters(filters) {
    this._filters = filters;
    this.dispatchEvent(new CustomEvent("update-filters", {detail: {filters: filters}}));
  }

  clearFilters() {
    this.applyFilters([]);
  }

  render(input) {
    let texture = input;
    this.getFilters().forEach(filter => {
      texture = filter.apply(texture);
    })

    return texture;
  }
}

export default Compositor;