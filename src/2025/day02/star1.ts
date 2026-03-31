import { subRangeInc } from "../../common/util";
import { Input } from "./parse";

export function solve(input: Input) {
  let totalInvalids = 0;

  for (const line of input.lines) {
    // console.log(line.text);
    const invalids = subRangeInc(line.start, line.end).filter(isInvalid);
    console.log(invalids);
    totalInvalids += invalids.map(Number).reduce((a, b) => a + b, 0);
  }
  return totalInvalids;
}

function isInvalid(num: number): boolean {
  const digits = String(num);
  const left = digits.slice(0, digits.length / 2);
  const right = digits.slice(digits.length / 2);
  return left === right;
}
