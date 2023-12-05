import { Input } from "./parse";

export function solve(input: Input) {
  const actualRed = 12;
  const actualGreen = 13;
  const actualBlue = 14;

  return input.games
    .map((game, i) => {
      const roundReview = game.rounds.map(round => {
        if (round.red > actualRed) return false;
        if (round.green > actualGreen) return false;
        if (round.blue > actualBlue) return false;
        return true;
      });
      return roundReview.every(x => x) ? i + 1 : 0;
    })
    .sum();
}
