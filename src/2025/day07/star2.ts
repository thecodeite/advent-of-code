import { Input } from "./parse";

export function solve(input: Input) {
  let map = input.lines.map(line => line.text.split(""));

  const startCol = map[0].indexOf("S");

  let routes = doRow(map, 1, startCol);

  return routes;
}

const resultCache = new Map<string, number>();

function doRow(map: string[][], row: number, col: number): number {
  const cacheKey = `${row},${col}`;
  if (resultCache.has(cacheKey)) {
    return resultCache.get(cacheKey)!;
  }

  if (row >= map.length) {
    return 1;
  }

  const rowCells = map[row];
  const cell = rowCells[col];

  if (cell === ".") {
    return doRow(map, row + 1, col);
  } else if (cell === "^") {
    const left = doRow(map, row + 1, col - 1);
    const right = doRow(map, row + 1, col + 1);
    const result = left + right;
    resultCache.set(cacheKey, result);
    return result;
  } else {
    throw new Error(`Unexpected cell ${cell} at row ${row}, col ${col}`);
  }
}
