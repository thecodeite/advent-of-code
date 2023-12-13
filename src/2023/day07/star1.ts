import { Input } from "./parse";

const FIVE_OF_A_KIND /* */ = 600000000;
const FOUR_OF_A_KIND /* */ = 500000000;
const FULL_HOUSE /*     */ = 400000000;
const THREE_OF_A_KIND /**/ = 300000000;
const TWO_PAIR /*       */ = 200000000;
const ONE_PAIR /*       */ = 100000000;
const HIGH_CARD /*      */ = 0;

const cardValues = "23456789TJQKA";
const hexValues = "0123456789ABC";
const scoreMap: Record<string, string> = [...cardValues].reduce(
  (acc, card, i) => ({ ...acc, [card]: hexValues[i] }),
  {},
);

function getScore(cards: string) {
  return parseInt([...cards].map(card => scoreMap[card]).join(""), 13);
}

function getHandType(hand: string) {
  const cards = Array.from([...hand].groupBy(x => x).entries())
    .map(([card, cards]) => ({ card, count: cards.length }))
    .sort((a, b) => b.count - a.count);

  const counts = cards.map(({ count }) => count);
  const [bestCount] = counts;

  if (counts.length === 1) {
    return FIVE_OF_A_KIND;
  } else if (counts.length === 2) {
    if (bestCount === 4) {
      return FOUR_OF_A_KIND;
    } else {
      return FULL_HOUSE;
    }
  } else if (counts.length === 3) {
    if (bestCount === 3) {
      return THREE_OF_A_KIND;
    } else {
      return TWO_PAIR;
    }
  } else if (counts.length === 4) {
    return ONE_PAIR;
  } else {
    return HIGH_CARD;
  }
}

export function solve(input: Input) {
  const result = input.lines
    .map(({ hand, bid }) => {
      const handType = getHandType(hand);
      const score = getScore(hand);
      const totalScore = handType + score;
      return { hand, bid, totalScore };
    })
    .sortBy(({ totalScore }) => totalScore)
    .map(({ bid, ...rest }, index) => ({
      ...rest,
      bid,
      winnings: bid * (index + 1),
    }));
  //console.log(result);
  return result.map(({ winnings }) => winnings).sum();
}

// First attempt: 251545216 -> Correct! (took 3.5ms)
