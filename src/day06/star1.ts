import { Input } from "./parse";

export function star1(input: Input) {
  const windows = input.chars.slidingG(4);
  let pos = 4;
  for (const window of windows) {
    if (new Set(window).size === 4) {
      console.log("solution to star 1:", window.join(""), "at", pos);
      break;
    }
    pos++;
  }
}
