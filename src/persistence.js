class PersistenceManager {
  constructor(key) {
    this.key = key;
    this._data = _loadData();
  }

  set(key, value) {
    this._data[key] = value;
    this.sync();
  }

  get(key, defaultValue = {}) {
    const data = this._data[key];
    if (data) {
      return data;
    } else {
      return defaultValue;
    }
  }

  sync() {
    localStorage.setItem(this.key, this.serialize());
  }

  serialize() {
    JSON.stringify(this._data);
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