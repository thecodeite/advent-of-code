import { Input } from "./parse";

export function solve(input: Input) {
  return input.lines
    .map(line => {
      const firstNumber = [...line].findIndex(char => char.match(/\d/));
      const lastNumber = [...line]
        .reverse()
        .findIndex(char => char.match(/\d/));

      const number = parseInt(
        line[firstNumber] + line[line.length - lastNumber - 1],
      );

      return number;
    })
    .sum();
}
