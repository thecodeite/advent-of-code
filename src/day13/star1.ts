import { dump, Input, Packet, Pair } from "./parse";

function compareList(listA: Packet, listB: Packet): boolean | null {
  // console.log("compare [a] to [b]:", dump(listA), dump(listA));
  // console.log("listA.length:", listA.length);
  const count = Math.max(listA.length, listB.length);
  for (let i = 0; i < count; i++) {
    const a = listA[i];
    const b = listB[i];

    if (a === undefined) return true;
    if (b === undefined) return false;

    // console.log("compare a to b:", a, b);
    if (!Array.isArray(a) && !Array.isArray(b)) {
      if (a < b) return true;
      if (a > b) return false;
    } else if (Array.isArray(a) && !Array.isArray(b)) {
      const res = compareList(a, [b]);
      if (res !== null) return res;
    } else if (!Array.isArray(a) && Array.isArray(b)) {
      const res = compareList([a], b);
      if (res !== null) return res;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      const res = compareList(a, b);
      if (res !== null) return res;
    } else {
      throw "err";
    }
  }
  return null;
}
function checkPair(pair: Pair) {
  return compareList(pair.a, pair.b);
}

export function solve(input: Input) {
  return input.pairs
    .map((p, i) => ({ right: checkPair(p), i: i + 1 }))
    .filter(({ right }) => right)
    .map(({ i }) => i)
    .sum();
}
