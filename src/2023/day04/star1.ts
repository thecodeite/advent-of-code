import { Input } from "./parse";

export function solve(input: Input) {


  return input.cards.map((card) => {
    const winning = card.yours.map((y) => card.winners.includes(y) ? 1 : 0);
    
    const winnerCount = winning.sum();
    const score = winnerCount > 0 ? Math.pow(2, winnerCount-1) : 0;

    return score;
  }).sum();
}

// Attempt: 22488
