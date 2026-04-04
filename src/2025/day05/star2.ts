import { Input } from "./parse";

interface MergedRange {
  min: number;
  max: number;
  next: MergedRange | null;
}

function insertRange(
  head: MergedRange | null,
  newMin: number,
  newMax: number,
  indent: string,
): MergedRange {
  if (head === null) {
    // console.log(
    //   `${indent}Creating new range ${newMin}-${newMax} as the head of the list.`,
    // );
    return { min: newMin, max: newMax, next: null };
  }

  if (newMax < head.min) {
    // New range is entirely before the head range, so insert it before the head.
    // console.log(
    //   `${indent}Inserting new range ${newMin}-${newMax} before head range ${head.min}-${head.max}`,
    // );
    return { min: newMin, max: newMax, next: head };
  } else if (newMin > head.max) {
    // New range is entirely after the head range, so insert it after the head.
    // console.log(
    //   `${indent}Inserting new range ${newMin}-${newMax} after head range ${head.min}-${head.max}`,
    // );
    head.next = insertRange(head.next, newMin, newMax, indent + "  ");
    return head;
  } else {
    // New range overlaps with the head range, so merge them and continue merging with the next ranges.
    const mergedMin = Math.min(head.min, newMin);
    const mergedMax = Math.max(head.max, newMax);
    // console.log(
    //   `${indent}Merging new range ${newMin}-${newMax} with head range ${head.min}-${head.max} to form ${mergedMin}-${mergedMax}`,
    // );
    return insertRange(head.next, mergedMin, mergedMax, indent + "  ");
  }
}

function printRanges(head: MergedRange | null) {
  let current = head;
  while (current !== null) {
    console.log(
      `Range: ${current.min}-${current.max} Size: ${current.max - current.min + 1}`,
    );
    current = current.next;
  }
}

function addUpRangeSizes(head: MergedRange | null): number {
  let totalSize = 0;
  let current = head;
  while (current !== null) {
    totalSize += current.max - current.min + 1;
    current = current.next;
  }
  return totalSize;
}

let mergedRanges: MergedRange | null = null;

function mergeAllRanges(input: Input) {
  if (mergedRanges !== null) {
    return;
  }

  for (const freshRangeLine of input.freshRangeLines) {
    const { min, max } = freshRangeLine.freshRange;
    // console.log(`Starting range ${min}-${max}`);
    mergedRanges = insertRange(mergedRanges, min, max, "");
  }
}

export function solve1(input: Input) {
  mergeAllRanges(input);
  let freshCount = 0;

  for (const productLine of input.productLines) {
    const id = productLine.productId;
    let current = mergedRanges;
    while (current !== null) {
      if (id >= current.min && id <= current.max) {
        freshCount++;
        break;
      }
      if (id < current.min) {
        // Since the ranges are sorted, if the ID is less than the current range's min, it won't be in any of the subsequent ranges either.
        break;
      }
      current = current.next;
    }
  }

  return freshCount;
}

export function solve2(input: Input) {
  mergeAllRanges(input);
  // printRanges(mergedRanges);

  return addUpRangeSizes(mergedRanges);
}
