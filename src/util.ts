if (!Array.prototype.sum) {
  Array.prototype.sum = function () {
    return this.reduce((p, c) => p + c);
  };
}

if (!Array.prototype.product) {
  Array.prototype.product = function () {
    return this.reduce((p, c) => p * c);
  };
}

if (!Array.prototype.max) {
  Array.prototype.max = function () {
    return Math.max(...this);
  };
}
if (!Array.prototype.min) {
  Array.prototype.min = function () {
    return Math.min(...this);
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

if (!Array.prototype.reverseSafe) {
  Array.prototype.reverseSafe = function <T>(): T[] {
    return [...this].reverse();
  };
}

export function range(length: number) {
  return Array.from({ length }, (_, i) => i);
}

export function repeat(char: string, length: number) {
  return Array.from({ length }, (_, i) => char).join("");
}
