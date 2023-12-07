import { Input } from "./parse";

export function solve(input: Input) {
  const {sections, seeds} = input
  const mappers = sections.map(({ maps }) => {
    return (input: number) => {
      const match = maps.find(({fromStart, length}) =>  
        (input >= fromStart && input <= fromStart+length));
      
      const result = match ? match.toStart + (input - match.fromStart) : input;
      
      process.stdout.write(` -> ${result}`)
      return result;
    };
  });

  // Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
  
  const locations = seeds.map(seed => {

    process.stdout.write(seed.toString());
   
    const result =  mappers.reduce((p,c) => c(p), seed);
    console.log();
    return result;
  });

  return Math.min(locations);
}
