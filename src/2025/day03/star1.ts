import { Input } from "./parse";

export function solve(input: Input) {
  const result = input.lines.map(line => {
    const maxIndex = line.batteries
      .slice(0, -1)
      .reduce((maxIndex, value, index, arr) => {
        if (value > arr[maxIndex]) {
          return index;
        }
        return maxIndex;
      }, 0);
    const penIndex = line.batteries.reduce((penIndex, value, index, arr) => {
      if (index <= maxIndex) {
        return penIndex;
      }
      if (penIndex === -1) {
        return index;
      }
      if (value > arr[penIndex]) {
        return index;
      }
      return penIndex;
    }, -1);

    const [a, b] =
      maxIndex < penIndex ? [maxIndex, penIndex] : [penIndex, maxIndex];
    const jolt = line.batteries[a] * 10 + line.batteries[b];
    // const sorted = line.batteries.slice().sort((a, b) => b - a);
    // const top = sorted[0];
    // const pen = sorted[1];
    // const jolt = top * 10 + pen;
    // console.log(line.text, ":", a, b, jolt);
    return jolt;
  });

  return result.sum();
}
