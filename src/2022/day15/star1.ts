import { Point, Vector } from "../../common/Vector";
import { Input, Ping } from "./parse";

function dump(sensors: Sensor[]) {
  const out: string[] = [];

  const points = sensors.flatMap(s => [s.at, s.beacon]);
  const allX = points.map(p => p.x);
  const allY = points.map(p => p.y);

  const startRow = allY.min();
  const endRow = allY.max();

  const startCol = allX.min();
  const endCol = allX.max();

  const leftPad = "   ";

  const colLabelLen = 2;
  for (let p = 0; p < colLabelLen; p++) {
    out.push(...leftPad);
    for (let col = startCol; col < endCol; col++) {
      if (col % 5 === 0) {
        const num = `${Math.abs(col)}`.padStart(colLabelLen, " ");
        out.push(num[p]);
      } else {
        out.push(" ");
      }
    }
    out.push("\n");
  }

  for (let row = startRow; row < endRow; row++) {
    out.push(...`${Math.abs(row)}`.padStart(colLabelLen, " "), " ");
    for (let col = startCol; col < endCol; col++) {
      const cover = sensors.map(s => s.symbolAt({ x: col, y: row }));
      let symbol = cover.reduce((p, c) => {
        if (!p) return c;
        if (c && p === "#") return c;
        return p;
      }, undefined);

      if (!symbol) {
        const inRange = sensors.find(s => s.isInRange({ x: col, y: row }));
        if (inRange) {
          symbol = inRange.id;
        }
      }

      out.push(symbol ?? ".");
    }
    out.push("\n");
  }
  out.push("\n");

  console.log(out.join(""));
}

function manhattanDistance(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

class Sensor implements Ping {
  id: string;
  at: Vector;
  beacon: Vector;
  range: number;

  constructor(ping: { id: string; at: Vector; beacon: Vector }) {
    this.id = ping.id;
    this.at = ping.at;
    this.beacon = ping.beacon;

    this.range = manhattanDistance(ping.at, ping.beacon);
  }

  isAt(point: Point) {
    return point.x === this.at.x && point.y === this.at.y;
  }

  isBeacon(point: Point) {
    return point.x === this.beacon.x && point.y === this.beacon.y;
  }

  isInRange(point: Point) {
    const distance = manhattanDistance(this.at, point);
    return distance <= this.range;
  }

  symbolAt(p: Point) {
    if (p.x === this.at.x && p.y === this.at.y) {
      return this.id.toUpperCase();
    }

    if (p.x === this.beacon.x && p.y === this.beacon.y) {
      return this.id.toLocaleLowerCase();
    }

    return undefined;
  }
}

export function solve(input: Input, rowToTest: number) {
  const sensors = input.pings.map(p => new Sensor(p));
  // dump(sensors);

  const maxRange = sensors.map(s => s.range).max();
  console.log("maxRange:", maxRange);
  const xStart = sensors.map(s => [s.at.x, s.beacon.x].min()).min() - maxRange;
  const xEnd = sensors.map(s => [s.at.x, s.beacon.x].max()).max() + maxRange;
  console.log("xStart, xEnd:", xStart, xEnd);
  console.log("xEnd-xStart:", xEnd - xStart);

  let count = 0;
  for (let x = xStart; x < xEnd; x++) {
    const p = { x, y: rowToTest };
    // console.log(
    //   x,
    //   sensors.some(s => s.isBeacon(p)),
    //   sensors.some(s => s.isInRange(p)),
    // );
    if (
      !sensors.some(s => s.isBeacon(p)) &&
      sensors.some(s => s.isInRange(p))
    ) {
      // console.log("x:", x);
      count++;
    }
  }
  return count;
}
