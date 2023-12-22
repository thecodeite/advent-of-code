import { subRange } from "../../common/util";
import { Input } from "./parse";

function findMidPoints(lines: string[]) {
  const range = subRange(1, lines[0].length);
  return lines.reduce((acc, line) => {
    if (acc.length === 0) return acc;
    // console.log(`"${line}"`);
    //for (let ml = 1; ml < line.length; ml++) {
    const valid = acc.filter(ml => {
      const usedLength = Math.min(ml, line.length - ml);
      const left = [...line.slice(0, ml)]
        .reverse()
        .slice(0, usedLength)
        .reverse()
        .join("");
      const right = [...line.slice(ml)].slice(0, usedLength).reverse().join("");
      // console.log(`${ml}  "${left}" "${right}"`);
      return left === right;
    });
    // console.log(`valid: ${valid}`);
    return valid;
  }, range);
}

export function solve(input: Input) {
  const { grids } = input;
  const midPoints = grids.flatMap(lines => {
    const hoz = findMidPoints(lines);
    const vert = findMidPoints(lines.rotateACW()).map(x => x * 100);
    return [...hoz, ...vert];
  });

  return midPoints.sum();
}

// 1st guess: 35210 (took 2.6ms) Correct!
