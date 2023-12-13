import { Input } from "./parse";
import { lcm } from "../../common/utils/lcm";

export function solve(input: Input) {
  const starts = [...input.map.keys()].filter(k => k.endsWith("A"));
  const locs = [...starts];

  const dirLength = input.directions.length;

  const periods = locs.map(loc => {
    let tick = 0;
    while (!loc.endsWith("Z")) {
      const index = tick % dirLength;

      const [left, right] = input.map.get(loc)!;
      loc = input.directions[index] === 0 ? left : right;

      tick++;
    }
    return tick;
  });

  return lcm(...periods);
}

// 1st try: 683839859994 -> Too low
// 2nd try: 22103062509257 -> Correct (took 6.7ms)
