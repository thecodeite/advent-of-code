import { Input } from "./parse";

function lookFrom(row: number, col: number, lines: number[][]) {
  const height = lines[row][col];

  let upCount = 0;
  for (let up = row - 1; up >= 0; up--) {
    upCount++;
    if (lines[up][col] >= height) {
      // console.log(`hit ${lines[up][col]} at ${[up, col]} going up`);
      break;
    }
  }

  let leftCount = 0;
  for (let left = col - 1; left >= 0; left--) {
    leftCount++;
    if (lines[row][left] >= height) {
      // console.log(`hit ${lines[row][left]} at ${[row, left]} going left`);
      break;
    }
  }

  let rightCount = 0;
  for (let right = col + 1; right < lines[row].length; right++) {
    rightCount++;
    if (lines[row][right] >= height) {
      // console.log(`hit ${lines[row][right]} at ${[row, right]} going right`);
      break;
    }
  }

  let downCount = 0;
  for (let down = row + 1; down < lines.length; down++) {
    downCount++;
    if (lines[down][col] >= height) {
      // console.log(`hit ${lines[down][col]} at ${[down, col]} going down`);
      break;
    }
  }

  return [upCount, leftCount, rightCount, downCount].product();
}

export function solve(input: Input) {
  const scores = input.lines.map((row, iR) =>
    row.map((_, iC) => lookFrom(iR, iC, input.lines)),
  );

  // console.log("scores:", scores);

  return scores.flat().max();
}
