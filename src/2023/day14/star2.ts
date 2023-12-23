import { rotateLinesCw, rotateLinesCcw } from "../../common/utils/rotate-lines";
import { Input } from "./parse";

function slideRight(grid: string[]) {
  return grid.map(line => {
    const spaces = line.split("#");
    const sorted = spaces.map(space => [...space].sort().join(""));
    return sorted.join("#");
  });
}

function calcLoad(grid: string[]) {
  return grid
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
}

const cycles = new Map<string, number>();

function dump(grid: string[]) {
  console.log(rotateLinesCcw(grid).join("\n") + "\n");
}

function spin(g: string[]) {
  let grid = slideRight(g);
  grid = rotateLinesCw(grid);
  grid = slideRight(grid);
  grid = rotateLinesCw(grid);
  grid = slideRight(grid);
  grid = rotateLinesCw(grid);
  grid = slideRight(grid);
  grid = rotateLinesCw(grid);
  return grid;
}

export function solve(input: Input) {
  let grid = rotateLinesCw(input.lines);

  // grid = spin(grid);
  // dump(grid);

  // grid = spin(grid);
  // dump(grid);

  // grid = spin(grid);
  // dump(grid);

  for (let i = 0; i < 2000; i++) {
    grid = spin(grid);
    // console.log(`i: ${i} load: ${calcLoad(grid)}`);

    const key = grid.join("\n");
    if (cycles.has(key)) {
      console.log(
        "Cycle found:",
        cycles.get(key),
        "to",
        i,
        "load:",
        calcLoad(grid),
      );
      const cycleLength = i - cycles.get(key)!;
      console.log("cycleLength:", cycleLength);
      const remaining = 1000000000 - i;
      console.log("remaining:", remaining);
      const remainingSteps = (remaining % cycleLength) - 1;
      console.log("remainingSteps:", remainingSteps);
      for (let j = 0; j < remainingSteps; j++) {
        grid = spin(grid);
      }
      break;
    } else {
      cycles.set(grid.join("\n"), i);
    }
  }
  const load = calcLoad(grid);

  return load;
}

// 1st attempt: 99118 - Correct! (Took 850.9ms)
