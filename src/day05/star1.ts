import { Input, format } from "./parse";

export function star1(input: Input) {
  // const finalState = input.moves.reduce((prvState, move) => {
  //   format(prvState);

  //   return applyMove(prvState, move);
  // }, input.state);
  // format(finalState);

  const finalState = input.moves.reduce(applyMove, input.state);

  const solution = finalState.map(col => col[col.length - 1]).join("");
  console.log("solution to star 1:", solution);
}

function applyMove(
  state: Input["state"],
  move: Input["moves"][0],
): Input["state"] {
  if (move.count < 1) return state;
  const toMove = state[move.from - 1][state[move.from - 1].length - 1];
  const nextState = state.map((row, i) => {
    const pos = i + 1;
    if (pos === move.from) return row.slice(0, -1);
    if (pos === move.to) return [...row, toMove];
    return row;
  });
  return applyMove(nextState, { ...move, count: move.count - 1 });
}
