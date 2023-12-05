import { Vector } from "../../common/Vector";

export interface Ping {
  id: string;
  at: Vector;
  beacon: Vector;
}

export interface Input {
  pings: Ping[];
}

function parseXY(xy?: string) {
  if (!xy) throw "missing data";
  const [x, y] = xy.split(", ").map(p => parseInt(p.slice(2)));
  return new Vector(x, y);
}

export function parse(file: string): Input {
  const pings = file.split("\n").map((line, i) => {
    const match = line.match(
      /Sensor at (?<at>.*): closest beacon is at (?<beacon>.*)/,
    );
    return {
      id: String.fromCharCode("a".charCodeAt(0) + i),
      at: parseXY(match?.groups?.at),
      beacon: parseXY(match?.groups?.beacon),
    };
  });
  return { pings };
}
