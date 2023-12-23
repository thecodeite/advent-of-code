import { Input } from "./parse";

export function solve(input: Input) {
  const { blocks } = input;

  const results = blocks.map(block =>
    [...block].reduce(
      (acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256,
      0,
    ),
  );

  return results.sum();
}

// 1st guess: 498538. Correct! (Took 1ms)
