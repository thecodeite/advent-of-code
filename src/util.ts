
if (!Array.prototype.sum) {
  Array.prototype.sum = function () {
    return this.reduce((p, c) => p + c);
  };
}
if (!Array.prototype.grouped) {
  Array.prototype.grouped = function (groupSize: number) {
    const result = [];
    for(let i=0; i<this.length; i+= groupSize) {
      result.push(this.slice(i, i+groupSize));
    }
    return result;
  };
}
