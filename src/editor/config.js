class Config extends EventTarget {
  #config = {};

  constructor(defaults = {}) {
    super();

    this._setDefaults(defaults);
  }

  get(key, fallback = undefined) {
    if (this.#config[key] !== undefined) {
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

  _setDefaults(defaults) {
    Object.entries(defaults).map(([key, value]) => {
      this.set(key, value);
    })
  }
}

export default Config;
