export class UniqueIdGenerator {
  constructor() {
    this.set = new Set();
  }

  uniqueId(value) {
    let unique = String(value).toLowerCase().replace(/\s+/g, '_');
    while (this.set.has(unique)) {
      unique = unique.replace(/(?:_(\d*))?$/, (m, n = 0) => `_${+n + 1}`);
    }
    this.set.add(unique);
    return unique;
  }
}
