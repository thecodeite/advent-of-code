import { Input } from "./parse";

export function solve(input: Input) {
  const cardCount: Record<number, number> = Object.fromEntries(
    input.cards.map((card) => [card.cardId, 1]));

  return input.cards.map((card) => {
    const winning = card.yours.map((y) => card.winners.includes(y) ? 1 : 0);
    
    const winnerCount = winning.sum();
    const copies = cardCount[card.cardId];
    const newCards = winnerCount * copies;
    console.log(`card ${card.cardId} has ${copies} copies and ${winnerCount} winners winning ${newCards} new cards `);

    for(let i = 1; i <= winnerCount; i++) {
      cardCount[card.cardId + i] += copies;
    }

    return copies;
  }).sum();
}

// Attempt 1: 7013204 - Correct!