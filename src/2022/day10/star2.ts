import { range, repeat } from "../../common/util";
import { Input } from "./parse";

export function solve(input: Input) {
  let xReg = 1;
  // let cycle = 0;
  const xRegHistory: number[] = [];

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

  const output = [];
  let cycle = 0;
  for (let row = 0; row < 6; row++) {
    output.length = 0;
    for (let pos = 0; pos < 40; pos++) {
      const inRange = Math.abs(pos - xRegHistory[cycle]) <= 1;
      cycle++;
      output.push(inRange ? "##" : "  ");
    }
    console.log(output.join(""));
  }

  return 0;
}
