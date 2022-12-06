if (!Array.prototype.sum) {
  Array.prototype.sum = function () {
    return this.reduce((p, c) => p + c);
  };
}

if (!Array.prototype.grouped) {
  Array.prototype.grouped = function (groupSize: number) {
    const result = [];
    for (let i = 0; i < this.length; i += groupSize) {
      result.push(this.slice(i, i + groupSize));
    }
    return result;
  };
}

if (!Array.prototype.rotateCW) {
  Array.prototype.rotateCW = function <T>(): T[][] {
    const result = [];
    const width = Math.max(...this.map(r => r.length));
    for (let i = 0; i < width; i++) {
      result.push(this.map((r, iC) => r[i]).reverse());
    }
    return result;
  };
}

if (!Array.prototype.rotateACW) {
  Array.prototype.rotateACW = function <T>(): T[][] {
    const result = [];
    const width = Math.max(...this.map(r => r.length));
    for (let i = 0; i < width; i++) {
      result.push(this.map(r => r[i]));
    }
    result.reverse();
    return result;
  };
}

if (!Array.prototype.take) {
  Array.prototype.take = function <T>(length: number): T[] {
    return this.filter((_, i) => i <= length - 1);
  };
}

if (!Array.prototype.slidingG) {
  Array.prototype.slidingG = function* (windowLength: number) {
    const windows = this.length - windowLength + 1;
    const clone = [...this];
    for (let i = 0; i < windows; i += 1) {
      yield clone.slice(i, i + windowLength);
    }
    return null;
  };
}
