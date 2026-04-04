import { Input } from "./parse";

export function solve(input: Input) {
  let freshCount = 0;
  for (const productLine of input.productLines) {
    const id = productLine.productId;
    const ranges = input.freshRangeLines.filter(freshRangeLine => {
      const { min, max } = freshRangeLine.freshRange;
      return id >= min && id <= max;
    });

    if (ranges.length === 0) {
      // console.log(`Ingredient ID ${id} is spoiled.`);
    } else {
      const rangeDescriptions = ranges
        .map(r => `${r.freshRange.min}-${r.freshRange.max}`)
        .join(" as well as ");
      // console.log(
      //   `Ingredient ID ${id} is fresh because it falls into range ${rangeDescriptions}.`,
      // );
      freshCount++;
    }
    // console.log(freshRangeLine);
  }

  return freshCount;
}
