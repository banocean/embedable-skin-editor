const fakeLocalStorage = {}
const localStorage = {
  setItem: (key, value) => {
    fakeLocalStorage[key] = value
  },
  getItem: (key) => fakeLocalStorage[key],
  removeItem: (key) => delete fakeLocalStorage[key]
}

class PersistenceManager {
  static instances = [];

  static resetAll() {
    this.instances.forEach(instance => {
      instance.reset();
    })
  }

  constructor(key) {
    this.key = key;
    this._data = this._loadData();
    PersistenceManager.instances.push(this);
  }

  set(key, value) {
    this._data[key] = value;
    this.sync();
  }

  setDefault(key, defaultValue) {
    if (!this.has(key)) {
      this.set(key, defaultValue);
      return defaultValue;
    }

    this.get(key);
  }

  get(key, defaultValue = {}) {
    const data = this._data[key];
    if (this.has(key)) {
      return data;
    } else {
      return defaultValue;
    }
  }

  getData(filterFunction = () => true) {
    const data = {};

    const keys = Object.keys(this._data).filter(filterFunction);

    keys.forEach(key => {
      data[key] = this._data[key];
    })

    return data;
  }

  has(key) {
    return Object.keys(this._data).includes(key);
  }

  sync() {
    localStorage.setItem(this.key, this.serialize());
  }

  serialize() {
    return JSON.stringify(this._data);
  }

  reset() {
    this._data = {};
    localStorage.removeItem(this.key);
  }

  _loadData() {
    const data = localStorage.getItem(this.key);
    if (data) {
      return JSON.parse(data);
    } else {
      return {};
    }
  }
}

export default PersistenceManager;
