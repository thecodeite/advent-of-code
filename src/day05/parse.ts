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

export function format(state: string[][]) {
  const length = Math.max(...state.map(col => col.length));
  const sameLength = state.map(col =>
    Array.from({ length }).map((_, i) => col[i]),
  );
  const vertical = sameLength
    .rotateACW()
    .map(row => row.map(ch => (ch ? `[${ch}]` : "   ")).join(" "));
  console.log(vertical.join("\n"));
  console.log(
    Array.from({ length: state.length }, (_, i) => ` ${i + 1} `).join(" "),
  );
  console.log(``);
}
