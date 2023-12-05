import { Input } from "./parse";

export function solve(input: Input) {
  return input.games
    .map((game, i) => {
      let neededRed = 0;
      let neededGreen = 0;
      let neededBlue = 0;
      game.rounds.forEach(round => {
        neededRed = Math.max(neededRed, round.red);
        neededGreen = Math.max(neededGreen, round.green);
        neededBlue = Math.max(neededBlue, round.blue);
      });
      const power = neededRed * neededGreen * neededBlue;
      return power;
    })
    .sum();
}
