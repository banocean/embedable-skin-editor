import BaseFilter from "./filters/base_filter";

class Compositor {
  filters = [];

  render(input) {
    let texture = input;
    this.filters.forEach(filter => {
      texture = filter.apply(texture);
    })

    return texture;
  }
}

export default Compositor;