import { format, Input } from "./parse";

export function star2(input: Input) {
  // format(input.state);
  const finalState = input.moves.reduce((prvState, move) => {
    // console.log("move:", move);
    const nextState = applyMove(prvState, move);

    // format(nextState);
    return nextState;
  }, input.state);

  const solution = finalState.map(col => col[col.length - 1]).join("");
  console.log("solution to star 2:", solution);
}

function applyMove(
  state: Input["state"],
  move: Input["moves"][0],
): Input["state"] {
  const toMove = state[move.from - 1].slice(-move.count);
  // console.log("toMove:", toMove);
  return state.map((row, i) => {
    const pos = i + 1;
    if (pos === move.from) return row.slice(0, -move.count);
    if (pos === move.to) return [...row, ...toMove];
    return row;
  });
}
