export interface Input {
  sets: number[][];
}

export function parse(file: string): Input {
  const sets = file.split("\n").map(str => str.split(" ").map(Number));
  return { sets };
}
