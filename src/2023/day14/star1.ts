import { rotateLinesCw, rotateLinesCcw } from "../../common/utils/rotate-lines";
import { Input } from "./parse";

export function solve(input: Input) {
  const grid = rotateLinesCw(input.lines).map(line => {
    const spaces = line.split("#");
    // console.log("spaces:", spaces);
    const sorted = spaces.map(space => [...space].sort().join(""));
    return sorted.join("#");
  });

  // const right = rotateLinesCcw(grid);

  const load = grid
    .map((line, i) => {
      let total = 0;
      for (let j = line.length - 1; j >= 0; j--) {
        if (line[j] === "O") {
          total += j + 1;
        }
      }
      // console.log("total:", total);
      return total;
    })
    .sum();

  // console.log(grid.join("\n"));

  return load;
}

// 1st attempt: 108789 - Too low (Off by 1 in end test in decrementing for loop
// 2nd attempt: 108792 - Correct! (Took 1.7ms)
