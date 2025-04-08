class BaseVersion {
  constructor(lastVersionClass, data) {
    if (this.versionCheck(data)) {
      this.loadData(data);
    } else {
      const transformedData = this.transformData(lastVersionClass, data);
      this.loadData(transformedData);
    }
  }
  data;

  // Extend these functions

  validateData(_data) {
    return true;
  }

  convert(data) {
    return data;
  }

  versionCheck(data) {
    return this.format == data.format;
  }

  // Don't extend these functions unless necessary
  transformData(lastVersionClass, data) {
    const lastVersion = new lastVersionClass(data);
    const newData = lastVersion.data;
    return this.convert(newData);
  }

  loadData(data) {
    if (this.validateData(data)) {
      this.data = data;
    } else {
      throw new Error("Invalid NCRS file!");
    }
  }
}

export default BaseVersion;