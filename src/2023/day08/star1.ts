import { Input } from "./parse";

export function solve(input: Input) {
  let loc = "AAA";
  let tick = 0;
  const dirLength = input.directions.length;

  while (tick < 1000000000 && loc !== "ZZZ") {
    const [left, right] = input.map.get(loc)!;
    const index = tick % dirLength;
    loc = input.directions[index] === 0 ? left : right;
    // console.log(`Move to ${loc}`);
    tick++;
  }

  return tick;
}

// First try: 20093 -> Correct (took 2.5ms)
