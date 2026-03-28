import { Input } from "./parse";

export function solve(input: Input) {
  let pos = 50;
  let pointedAtZeroCount = 0;

  // console.log(`The dial starts by pointing at ${pos}`);

  for (const line of input.lines) {
    pos = (pos + line.normalized) % 100;
    if (pos === 0) {
      pointedAtZeroCount++;
    }
    // console.log(`The dial is rotated ${line.text} to point at ${pos}`);
  }

  console.log(
    `Because the dial points at 0 a total of ${pointedAtZeroCount} times during this process, the password in this example is "${pointedAtZeroCount}".`,
  );
  return pointedAtZeroCount;
}
