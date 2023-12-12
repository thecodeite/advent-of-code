import { Input } from "./parse";

export function solve(input: Input) {
  const { sections, seeds } = input
  const mappers = sections.map(({ maps }) => {
    return (input: number) => {
      const match = maps.find(({ fromStart, length }) =>
        (input >= fromStart && input <= fromStart + length));

      const result = match ? match.toStart + (input - match.fromStart) : input;

      process.stdout.write(` -> ${result}`)
      return result;
    };
  });


  const seePairs: number[][] = Array.from({ length: seeds.length / 2 }, (_, i) => seeds.slice(i * 2, i * 2 + 2));

  function* allSeeds() {
    for (const seedPair of seePairs) {
      const [start, length] = seedPair;
      console.log(start, length);
      for (let i = 0; i < length; i++) {
        yield start + i;
      }
    }
  }

  // count number of entries in allSeeds
  let count = 0;
  for (const _ of allSeeds()) {
    count++;
  }
  console.log(count);

  throw new Error('stop');

  const locations = [1].map(seed => {

    process.stdout.write(seed.toString());

    const result = mappers.reduce((p, c) => c(p), seed);
    console.log();
    return result;
  });

  return Math.min(...locations);
}

// trying: 379811651
