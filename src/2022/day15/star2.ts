import { Point, Vector } from "../../common/Vector";
import { Input, Ping } from "./parse";

function dump(sensors: Sensor[], max: number) {
  const out: string[] = [];

  const points = sensors.flatMap(s => [s.at, s.beacon]);
  const allX = points.map(p => p.x);
  const allY = points.map(p => p.y);

  const startRow = 0; //allY.min();
  const endRow = max; // allY.max();

  const startCol = 0; // allX.min();
  const endCol = max; //allX.max();

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
      const cover = sensors.find(s => s.isInRange({ x: col, y: row }));
      const skip = cover?.skip({ x: col, y: row });
      let symbol = skip === undefined ? undefined : skip + "";

      // String.fromCharCode("a".charCodeAt(0) + );

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

  skip(point: Point) {
    // //return this.range - manhattanDistance(this.at, point);
    // return this.range;
    const dx = this.at.x - point.x;
    const dy = this.at.y - point.y;
    return Math.floor((this.range + dx + dy) / 2);
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

export function solve(input: Input, max: number) {
  const sensors = input.pings.map(p => new Sensor(p));
  // dump(sensors, max);

  let checked = 0;
  for (let rowStart = 0; rowStart < max; rowStart++) {
    for (let col = 0; col < max - rowStart; col++) {
      const row = rowStart + col;
      const p = { x: col, y: row };
      // console.log("[col,row]:", [col, row]);
      const inRange = sensors.find(s => s.isInRange(p));
      checked++;

      if (!inRange) {
        return ["done!", [row, col], col * max + row, { checked }];
      }
      //col += inRange.range - 1;
      col += inRange.skip(p);
    }
  }

  for (let colStart = 1; colStart < max; colStart++) {
    for (let row = 0; row < max - colStart; row++) {
      const col = colStart + row;
      const p = { x: col, y: row };
      const inRange = sensors.find(s => s.isInRange(p));
      checked++;

      if (!inRange) {
        return ["done!", [row, col], col * max + row, { checked }];
      }
      // console.log("p:", p, inRange.skip(p));
      row += inRange.skip(p);
    }
  }

  // const ranges = sensors.map(s => s.range);
  // console.log("ranges:", ranges);
  // console.log("maxRange:", maxRange);
  // const xStart = sensors.map(s => [s.at.x, s.beacon.x].min()).min() - maxRange;
  // const xEnd = sensors.map(s => [s.at.x, s.beacon.x].max()).max() + maxRange;
  // console.log("xStart, xEnd:", xStart, xEnd);
  // console.log("xEnd-xStart:", xEnd - xStart);

  // let count = 0;
  // for (let x = xStart; x < xEnd; x++) {
  //   const p = { x, y: rowToTest };
  //   // console.log(
  //   //   x,
  //   //   sensors.some(s => s.isBeacon(p)),
  //   //   sensors.some(s => s.isInRange(p)),
  //   // );
  //   if (
  //     !sensors.some(s => s.isBeacon(p)) &&
  //     sensors.some(s => s.isInRange(p))
  //   ) {
  //     // console.log("x:", x);
  //     count++;
  //   }
  // }
  console.log("checked:", checked);
  return 0;
}
