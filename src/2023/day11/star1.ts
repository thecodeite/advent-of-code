import { rotateLinesCw, rotateLinesCcw } from "../../common/utils/rotate-lines";
import { Input } from "./parse";

export function solve(input: Input) {
  const { lines } = input;

  const emptyRows = lines
    .map((line, y) => ({ line, y }))
    .filter(({ line }) => !line.includes("#"))
    .map(({ y }) => y);

  const emptyCols = rotateLinesCw(lines)
    .map((line, y) => ({ line, y }))
    .filter(({ line }) => !line.includes("#"))
    .map(({ y }) => y);

  const withAddedRows = lines.flatMap((line, i) => {
    if (emptyRows.includes(i)) return [line, line];
    return [line];
  });

  const withAddedCols = rotateLinesCw(withAddedRows).flatMap((line, i) => {
    if (emptyCols.includes(i)) return [line, line];
    return [line];
  });

  const universe = rotateLinesCcw(withAddedCols);

  const width = universe[0].length;

  const galaxies = [...universe.join("")]
    .map((char, i) => ({ char, i }))
    .filter(({ char }) => char === "#")
    .map(({ i }) => i);

  const pos = galaxies.map((i, index) => ({
    index,
    x: i % width,
    y: Math.floor(i / width),
  }));

  const distances: number[] = [];
  for (let first = 0; first < pos.length; first++) {
    for (let second = first + 1; second < pos.length; second++) {
      const distance =
        Math.abs(pos[first].x - pos[second].x) +
        Math.abs(pos[first].y - pos[second].y);
      // console.log(`from ${first + 1} to ${second + 1}: ${distance}`);
      distances.push(distance);
    }
  }

  return distances.sum();
}

// 1st guess: 9543156 -> Correct! (Took 32ms)
