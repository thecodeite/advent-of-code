export type PathMove = number | "L" | "R";
export type Map = string[][];
export type Pos = [number, number];
export type Dir = ">" | "v" | "<" | "^";
export interface Input {
  map: Map;
  path: PathMove[];
  start: Pos;
  dir: Dir;
}

export function parse(file: string): Input {
  const [mapPart, pathPart] = file.split("\n\n");

  const map = mapPart.split("\n").map(s => [...s]);
  const path = pathPart
    .replace(/(R|L)/g, ",$1,")
    .split(",")
    .map(m => {
      if (m === "L" || m === "R") return m as PathMove;
      else return parseInt(m) as PathMove;
    });

  return { map, path, start: [0, 0], dir: ">" };
}
