export interface Input {
  state: string[][];
  moves: { count: number; from: number; to: number }[];
}

export function parse(file: string): Input {
  const [stateStr, movesStr] = file.split("\n\n");

  const stateRows = stateStr.split("\n").map(r => r.split(""));
  const stateCols = stateRows.rotateCW();

  const state = stateCols
    .filter((_, i) => i % 4 === 1)
    .map(row => row.filter((v, i) => i !== 0 && v !== " "));

  const moves = movesStr
    .split("\n")
    .map(line =>
      line
        .split(" ")
        .map(s => parseInt(s))
        .filter(c => !isNaN(c)),
    )
    .map(([count, from, to]) => ({ count, from, to }));
  return { state, moves };
}
