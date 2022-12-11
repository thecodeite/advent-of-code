import { range, repeat } from "../util";
import { Input } from "./parse";

export function solve(input: Input) {
  let xReg = 1;
  // let cycle = 0;
  const xRegHistory: number[] = [xReg];

  const { lines } = input;
  while (lines.length > 0) {
    const line = lines.shift();
    if (line?.cmd === "noop") {
      // cycle += 1;
      xRegHistory.push(xReg);
    } else if (line?.cmd === "addx") {
      // cycle += 1;
      xRegHistory.push(xReg);
      // cycle += 1;
      xRegHistory.push(xReg);
      xReg += line.arg;
    }
  }
  xRegHistory.push(xReg);

  const min = xRegHistory.min();
  const max = xRegHistory.max();

  const scale = 100 / (max - min);
  const offset = min;

  if (false) {
    console.log("    #");
    console.log("    #");
    console.log("####+" + repeat("#", 100));
    xRegHistory.forEach((x, i) => {
      const scaled = Math.floor((x + offset) * scale);
      let line = [...repeat(" ", 100)];
      line[scaled] = "*";
      console.log(`${i}`.padEnd(4, " ") + "#" + line.join(""));
    });
  }

  let sum = 0;
  for (let n = 20; n < xRegHistory.length; n += 40) {
    // console.log(n, xRegHistory[n], xRegHistory[n] * n);
    sum += xRegHistory[n] * n;
  }

  // console.log("xRegHistory:", xRegHistory);

  return sum;
}
