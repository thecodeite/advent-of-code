export interface Point {
  x: number;
  y: number;
}

export class Vector implements Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  eq(v?: Vector) {
    if (!v) return false;
    return v.x == this.x && v.y === this.y;
  }
  add(v: Vector): Vector {
    return new Vector(v.x + this.x, v.y + this.y);
  }

  toString() {
    return `${this.x},${this.y}`;
  }
  valueOf() {
    return `${this.x},${this.y}`;
  }

  up() {
    return new Vector(this.x, this.y - 1);
  }
  down() {
    return new Vector(this.x, this.y + 1);
  }
  left() {
    return new Vector(this.x - 1, this.y);
  }
  right() {
    return new Vector(this.x + 1, this.y);
  }

  valid(width: number, height: number) {
    return this.x >= 0 && this.x < width && this.y >= 0 && this.y < height;
  }

  delta(target: Vector) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return { dx, dy };
  }

  squDistTo(target: Vector) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return dx * dx + dy * dy;
  }

  symbolFrom(target: Vector) {
    const del = this.delta(target);
    const d = `${del.dx},${del.dy}`;
    // console.log("d:", d);
    if (d === "-1,0") return ">";
    if (d === "1,0") return "<";
    if (d === "0,-1") return "v";
    if (d === "0,1") return "^";
    return "*";
  }
}
