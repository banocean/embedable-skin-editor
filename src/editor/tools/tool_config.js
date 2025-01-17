class ToolConfig extends EventTarget {
  #config = {};

  constructor() {
    super();

    this.set("size", 1);
    this.set("color", { r: 255, g: 0, b: 0, a: 255 });
  }

  get(key, fallback = undefined) {
    if (this.#config[key]) {
      return this.#config[key];
    }
    
    return fallback;
  }

  set(key, value) {
    if (this.#config[key] === value) {
      return value;
    }

    this.#config[key] = value;
    this.dispatchEvent(new CustomEvent(`${key}-change`, { detail: value }));

    return value;
  }
}

export default ToolConfig;
