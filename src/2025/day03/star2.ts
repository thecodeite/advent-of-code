import { Input } from "./parse";

const numSize = 12;

function reduceMaxIndex(
  maxIndex: number,
  value: number,
  index: number,
  arr: number[],
) {
  if (value > arr[maxIndex]) {
    return index;
  }
  return maxIndex;
}

export function solve(input: Input) {
  const result = input.lines.map(line => {
    let jolt = 0;
    let lastIndex = 0;
    for (let i = 0; i < numSize; i++) {
      const fromEnd = numSize - i - 1;
      const arr =
        fromEnd > 0
          ? line.batteries.slice(lastIndex, -fromEnd)
          : line.batteries.slice(lastIndex);
      const maxIndex = arr.reduce(reduceMaxIndex, 0);
      lastIndex = lastIndex + maxIndex + 1;
      const max = arr[maxIndex];
      jolt = jolt * 10 + max;
    }
    return jolt;
  });

  return result.sum();
}
