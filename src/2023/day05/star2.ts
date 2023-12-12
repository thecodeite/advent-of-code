import { Input } from "./parse";

export function solve(input: Input) {
  const { sections, seeds } = input;
  const mappers = sections.map(({ maps }) => {
    return (input: number) => {
      const match = maps.find(
        ({ fromStart, length }) =>
          input >= fromStart && input <= fromStart + length,
      );

      const result = match ? match.toStart + (input - match.fromStart) : input;

      // process.stdout.write(` -> ${result}`);
      return result;
    };
  });

  const seePairs: number[][] = Array.from(
    { length: seeds.length / 2 },
    (_, i) => seeds.slice(i * 2, i * 2 + 2),
  );
  const totalSeeds = seePairs.reduce((p, [start, length]) => p + length, 0);

  let count = 0;
  function* allSeeds() {
    for (const seedPair of seePairs) {
      const [start, length] = seedPair;
      for (let i = 0; i < length; i++) {
        yield start + i;
      }
      console.log(
        `Completed ${start} of ${totalSeeds} seeds (${(
          (count / totalSeeds) *
          100
        ).toFixed(2)}%)`,
      );
    }
  }

  let lowest = Infinity;
  for (const seed of allSeeds()) {
    count++;
    const result = mappers.reduce((p, c) => c(p), seed);
    if (result < lowest) {
      lowest = result;
    }
  }
  console.log({ count, lowest });

  // throw new Error("stop");

  // const locations = [1].map(seed => {
  //   process.stdout.write(seed.toString());

  //   const result = mappers.reduce((p, c) => c(p), seed);
  //   console.log();
  //   return result;
  // });

  // return Math.min(...locations);
  return lowest;
}

// trying: 27992443, Correct, Took 5:57.216
