import { Input } from "./parse";

const FIVE_OF_A_KIND /* */ = 600000000;
const FOUR_OF_A_KIND /* */ = 500000000;
const FULL_HOUSE /*     */ = 400000000;
const THREE_OF_A_KIND /**/ = 300000000;
const TWO_PAIR /*       */ = 200000000;
const ONE_PAIR /*       */ = 100000000;
const HIGH_CARD /*      */ = 0;

const cardValues = "J23456789TQKA";
const hexValues = "0123456789ABC";
const scoreMap: Record<string, string> = [...cardValues].reduce(
  (acc, card, i) => ({ ...acc, [card]: hexValues[i] }),
  {},
);

function getScore(cards: string) {
  return parseInt([...cards].map(card => scoreMap[card]).join(""), 13);
}

function getHandType(hand: string) {
  const jokers = [...hand].filter(x => x === "J").length;
  // console.log("jokers:", jokers);

  if (jokers === 0) {
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
  } else {
    const otherCards = hand.replace(/J/g, "");
    const cards = Array.from([...otherCards].groupBy(x => x).entries())
      .map(([card, cards]) => ({ card, count: cards.length }))
      .sort((a, b) => b.count - a.count);

    const counts = cards.map(({ count }) => count);
    const [bestCount] = counts;

    if (jokers === 1) {
      // AAAA
      if (counts.length === 1) {
        return FIVE_OF_A_KIND;
        // AAAB or AABB
      } else if (counts.length === 2) {
        if (bestCount === 3) {
          return FOUR_OF_A_KIND;
        } else {
          return FULL_HOUSE;
        }
        // AABC
      } else if (counts.length === 3) {
        return THREE_OF_A_KIND;
        // ABCD
      } else {
        return ONE_PAIR;
      }
    } else if (jokers === 2) {
      // AAA
      if (counts.length === 1) {
        return FIVE_OF_A_KIND;
        // AAB
      } else if (counts.length === 2) {
        return FOUR_OF_A_KIND;
        // ABC
      } else {
        return THREE_OF_A_KIND;
      }
    } else if (jokers === 3) {
      // AA
      if (counts.length === 1) {
        return FIVE_OF_A_KIND;
        // AB
      } else {
        return FOUR_OF_A_KIND;
      }
    } else {
      return FIVE_OF_A_KIND;
    }
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
  // console.log(result);
  return result.map(({ winnings }) => winnings).sum();
}

// First attempt: 250384185 -> Correct! (took 3.5ms)
