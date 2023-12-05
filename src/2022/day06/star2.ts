import { Input } from "./parse";

export function star2(input: Input) {
  const windowSize = 14;
  const windows = input.chars.slidingG(windowSize);
  let pos = windowSize;
  for (const window of windows) {
    if (new Set(window).size === windowSize) {
      console.log("solution to star 2:", window.join(""), "at", pos);
      break;
    }
    pos++;
  }
}
