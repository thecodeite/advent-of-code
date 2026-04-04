import { Point } from "../../common/Vector";

export interface Input {
  data: Record<string, Location>;
  width: number;
  height: number;
}

export interface Location {
  p: Point;
  char: string;
}

export function parse(file: string): Input {
  // const lines = file.split("\n").map(text => ({ text }));
  const lines = file.split("\n");
  const height = lines.length;
  const width = lines.map(line => line.length).max();

  const data: Record<string, Location> = {};
  let x = 0;
  let y = 0;
  for (const line of lines) {
    for (const char of line) {
      const p: Point = { x, y };
      const index = `${p.x},${p.y}`;
      data[index] = { p, char };
      x++;
    }
    x = 0;
    y++;
  }
  // console.log("data:", data);
  return { data, width, height };
}
