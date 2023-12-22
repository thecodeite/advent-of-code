import { subRange } from "../../common/util";
import { rotateLinesCcw } from "../../common/utils/rotate-lines";
import { Input } from "./parse";

function calcNumDifferences(left: string, right: string) {
  return [...left]
    .map((c, i) => ({ c, i }))
    .filter(({ c }, i) => c !== right[i])
    .map(({ i }) => i);
}

interface Diff {
  num: number;
  ml: number;
  pass: boolean;
}
function findMidPoints(lines: string[]) {
  const range = subRange(1, lines[0].length).map(ml => ({
    num: 0,
    ml,
    pass: true,
  })) as Diff[];

  const posList = lines.reduce((acc, line, lineNo) => {
    // console.log(`LINE ${lineNo})`, line);
    if (acc.length === 0) return acc;
    // console.log(`"${line}"`);
    //for (let ml = 1; ml < line.length; ml++) {
    const possible = acc.map(p => {
      const usedLength = Math.min(p.ml, line.length - p.ml);
      const left = [...line.slice(0, p.ml)]
        .reverse()
        .slice(0, usedLength)
        .reverse()
        .join("");
      const right = [...line.slice(p.ml)]
        .slice(0, usedLength)
        .reverse()
        .join("");
      const diff = calcNumDifferences(left, right);
      // if (diff.length === 1) {
      //   console.log(`${p.ml}  "${left}" "${right}"`);
      //   // diffs = diff.map(d => ({
      //   //   d,
      //   //   ml: p.ml,
      //   //   a: p.ml - d - 1,
      //   //   b: p.ml + usedLength - d - 1,
      //   // }));
      //   // console.log(p.ml, "diffs:", diffs.length);
      // }
      // if (diff.length === 0) {
      //   console.log(p.ml, "mirror");
      // }
      const nextDiff = {
        num: diff.length,
        ml: p.ml,
        pass: false,
      } as Diff;

      if (nextDiff.num === 0) {
        nextDiff.pass = true;
        if (p.num > 0) {
          nextDiff.num = p.num;
        }
      }

      if (nextDiff.num === 1 && p.num === 0) {
        // console.log({ ml: p.ml, nextDiff_num: nextDiff.num, p_num: p.num });
        nextDiff.pass = true;
      }

      // if (nextDiff.num === 1 && p.num > 0) {
      //   nextDiff.pass = false;
      // }

      return nextDiff;
    });

    // console.log("possible", possible);
    return possible.filter(({ pass }) => pass);
  }, range);

  const withSingleDiff = posList.filter(({ num }) => num === 1);
  // console.log("withSingleDiff:", withSingleDiff);
  return withSingleDiff;
}

export function solve(input: Input) {
  const { grids } = input;
  const midPoints = grids.flatMap(lines => {
    const hoz = findMidPoints(lines).map(x => x.ml);
    // console.log("hoz:", hoz);
    const vert = findMidPoints(rotateLinesCcw(lines)).map(x => x.ml * 100);
    // console.log("vert:", vert);
    return [...hoz, ...vert];
  });

  return midPoints.sum();
}

// 1st guess: 31974 (took 6ms) Correct!
