import { Input2 } from "./parse";

export function solve(input: Input2) {
  const total = input.lines.reduce(
    (acc, line) =>
      acc + (line.op === "*" ? line.numbers.product() : line.numbers.sum()),
    0,
  );

  return total;
}
