import { rotateLinesCw, rotateLinesCcw } from "../../common/utils/rotate-lines";
import { Input } from "./parse";
// const log = (...args: any[]) => console.log(...args);
const log = (...args: any[]) => {};
const space = 1000000;

const check: Record<string, number> = {
  "1,2": 6,
  "1,3": 6,
  "1,4": 9,
  "1,5": 9,
  "1,6": 15,
  "1,7": 15,
  "1,8": 15,
  "1,9": 12,
  "2,3": 10,
  "2,4": 5,
  "2,5": 13,
  "2,6": 9,
  "2,7": 9,
  "2,8": 19,
  "2,9": 14,
  "3,4": 11,
  "3,5": 5,
  "3,6": 17,
  "3,7": 17,
  "3,8": 9,
  "3,9": 14,
  "4,5": 8,
  "4,6": 6,
  "4,7": 6,
  "4,8": 14,
  "4,9": 9,
  "5,6": 12,
  "5,7": 12,
  "5,8": 6,
  "5,9": 9,
  "6,7": 6,
  "6,8": 16,
  "6,9": 11,
  "7,8": 10,
  "7,9": 5,
  "8,9": 5,
};

export function solve(input: Input) {
  const lines = input.lines; //.map(line => line.replace(/\./g, "1"));

  const emptyRows = lines
    .map((line, y) => ({ line, y }))
    .filter(({ line }) => !line.includes("#"))
    .map(({ y }) => y);

  const emptyCols = rotateLinesCw(lines)
    .map((line, y) => ({ line, y }))
    .filter(({ line }) => !line.includes("#"))
    .map(({ y }) => y);

  const withAddedRows = lines.map((line, i) => {
    if (emptyRows.includes(i)) {
      return Array.from({ length: line.length }, () => "*").join("");
    }
    return line;
  });

  const withAddedCols = rotateLinesCw(withAddedRows).flatMap((line, i) => {
    if (emptyCols.includes(i)) {
      return Array.from({ length: line.length }, () => "*").join("");
    }
    return line;
  });

  const universe = rotateLinesCcw(withAddedCols);
  log(universe.join("\n"));

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
      log(`from ${first + 1} to ${second + 1}`);
      // const distance =
      //   Math.abs(pos[first].x - pos[second].x) +
      //   Math.abs(pos[first].y - pos[second].y);
      const xRange = [pos[first].x, pos[second].x].sortBy();
      log("xRange:", xRange);
      const xSlice = universe[pos[first].y].slice(xRange[0] + 1, xRange[1]);
      log("xSlice:", xSlice);
      const xDistance = [...xSlice]
        .map(char => (char === "*" ? space : 1))
        .sum();
      log("xDistance:", xDistance);
      //distances.push(distance);

      const yRange = [pos[first].y, pos[second].y].sortBy();
      log("yRange:", yRange);
      const ySlice = universe
        .slice(yRange[0] + 1, yRange[1])
        .map(line => line[pos[second].x]);
      log("ySlice:", ySlice.join(""));
      const yDistance = ySlice.map(char => (char === "*" ? space : 1)).sum();
      log("yDistance:", yDistance);

      let distance = xDistance + yDistance + 1;
      if (xRange[0] - xRange[1] !== 0 && yRange[0] - yRange[1] !== 0) {
        distance += 1;
      }
      distances.push(distance);
      log("distance:", distance);
      log(`Expected: ${check[`${first + 1},${second + 1}`]}`);
      log();
    }
  }

  return distances.sum();
}

/*
..*1.*..*.
..*..*.2*.
3.*..*..*.
**********
..*..*4.*.
.5*..*..*.
..*..*..*6
**********
..*..*.7*.
8.*.9*..*.

from 1 to 2: 6
from 1 to 3: 6
from 1 to 4: 9
from 1 to 5: 9
from 1 to 6: 15
from 1 to 7: 15
from 1 to 8: 15
from 1 to 9: 12
from 2 to 3: 10
from 2 to 4: 5
from 2 to 5: 13
from 2 to 6: 9
from 2 to 7: 9
from 2 to 8: 19
from 2 to 9: 14
from 3 to 4: 11
from 3 to 5: 5
from 3 to 6: 17
from 3 to 7: 17
from 3 to 8: 9
from 3 to 9: 14
from 4 to 5: 8
from 4 to 6: 6
from 4 to 7: 6
from 4 to 8: 14
from 4 to 9: 9
from 5 to 6: 12
from 5 to 7: 12
from 5 to 8: 6
from 5 to 9: 9
from 6 to 7: 6
from 6 to 8: 16
from 6 to 9: 11
from 7 to 8: 10
from 7 to 9: 5
from 8 to 9: 5
*/

// 1st guess: 82000210 -> Too low (Used test data)
// 2nd guess: 625243292686 -> Correct! (Took 457.934ms)
