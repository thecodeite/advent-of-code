export class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
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

export interface Chart {
  width: number;
  height: number;
  heights: Record<string, number>;
}

export interface Input {
  start: Vector;
  end: Vector;
  chart: Chart;
}

export const charRefA = "a".charCodeAt(0);

export function parse(file: string): Input {
  const lines = file.split("\n");
  let start: Vector | undefined;
  let end: Vector | undefined;
  const heights: Record<string, number> = {};
  lines.forEach((line, row) =>
    [...line].forEach((char, col) => {
      let height;
      if (char === "S") {
        start = new Vector(col, row);
        height = 1;
      } else if (char === "E") {
        end = new Vector(col, row);
        height = 26;
      } else {
        height = char.charCodeAt(0) - charRefA;
      }
      heights[`${col},${row}`] = height;
    }),
  );

  if (!start || !end) throw "no s or e";

  return {
    start,
    end,
    chart: {
      width: lines[0].length,
      height: lines.length,
      heights,
    },
  };
}
