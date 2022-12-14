import { dump, Input, Packet, Pair } from "./parse";

function compareList(listA: Packet, listB: Packet): number | null {
  // console.log("compare [a] to [b]:", dump(listA), dump(listA));
  // console.log("listA.length:", listA.length);
  const count = Math.max(listA.length, listB.length);
  for (let i = 0; i < count; i++) {
    const a = listA[i];
    const b = listB[i];

    if (a === undefined) return -1;
    if (b === undefined) return 1;

    // console.log("compare a to b:", a, b);
    if (!Array.isArray(a) && !Array.isArray(b)) {
      if (a < b) return -1;
      if (a > b) return 1;
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

function doSort(listA: Packet, listB: Packet) {
  const res = compareList(listA, listB);
  if (res === null) throw "err null";
  return res;
}

export function solve(input: Input) {
  const all = [...input.pairs.flatMap(p => [p.a, p.b]), [[2]], [[6]]];
  const sorted = all.sort((a, b) => doSort(a, b)).map(dump);

  const p1 = sorted.findIndex(p => p === "[[2]]") + 1;
  const p2 = sorted.findIndex(p => p === "[[6]]") + 1;

  console.log("p1, p2:", p1, p2);
  return p1 * p2;
}
