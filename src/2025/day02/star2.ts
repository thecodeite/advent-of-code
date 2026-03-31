import { subRangeInc } from "../../common/util";
import { Input } from "./parse";

export function solve(input: Input) {
  let totalInvalids = 0;

  for (const line of input.lines) {
    // console.log(line.text);
    const allIds = subRangeInc(line.start, line.end);
    const invalids = allIds.filter(num => isInvalid(String(num).split("")));
    // for (const num of allIds) {
    //   console.log(num, isInvalid(String(num).split("")));
    // }
    // console.log(line.text, invalids, line.end.toString().length);
    totalInvalids += invalids.map(Number).reduce((a, b) => a + b, 0);
    // totalInvalids += invalids.length;
  }
  return totalInvalids;
}

function isInvalid(s: string[]): boolean {
  const len = s.length;

  if (len === 1) {
    return false; // Single-digit numbers can't be invalid
  }

  if (new Set(s).size === 1) {
    return true; // All digits are the same
  }

  if (len === 4) {
    return s[0] === s[2] && s[1] === s[3]; // Four-digit numbers are invalid if they form two pairs of identical digits
  } else if (len === 6) {
    if (s[0] + s[1] + s[2] === s[3] + s[4] + s[5]) return true;
    const pair = s[0] + s[1];
    if (pair === s[2] + s[3] && pair === s[4] + s[5]) return true;
    return false;
  } else if (len === 8) {
    if (s[0] + s[1] + s[2] + s[3] === s[4] + s[5] + s[6] + s[7]) return true;
    const p = s[0] + s[1];
    if (p === s[2] + s[3] && p === s[4] + s[5] && p === s[6] + s[7])
      return true;
    return false;
  } else if (len === 9) {
    const trip = s[0] + s[1] + s[2];
    return trip === s[3] + s[4] + s[5] && trip === s[6] + s[7] + s[8];
  } else if (len === 10) {
    if (s[0] + s[1] + s[2] + s[3] + s[4] === s[5] + s[6] + s[7] + s[8] + s[9]) {
      return true;
    }
    const pair = s[0] + s[1];
    if (
      pair === s[2] + s[3] &&
      pair === s[4] + s[5] &&
      pair === s[6] + s[7] &&
      pair === s[8] + s[9]
    ) {
      return true;
    }
    return false;
  } else {
    if (len > 10)
      throw new Error(
        `Number ${s.join("")} has more than 10 digits, which is not supported.`,
      );

    return false;
  }
}
