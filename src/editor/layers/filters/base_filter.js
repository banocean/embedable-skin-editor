class BaseFilter {
  constructor(properties = {}) {
    this.properties = properties;
  }

  apply(canvas) {
    return canvas;
  }
}

export default BaseFilter;