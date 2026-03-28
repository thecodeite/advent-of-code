import { digitToAdverbial } from "../../common/utils/digit-to-words";
import { Input } from "./parse";

export function solve(input: Input) {
  let pos = 50;
  let pointedAtZeroCount = 0;
  let passesZeroDuringRotationCount = 0;

  console.log(`The dial starts by pointing at ${pos}`);

  // for (const line of input.lines) {
  //   const newPos = pos + line.normalized;
  //   pos = (newPos + 100) % 100;

  //   if (pos === 0) {
  //     pointedAtZeroCount++;
  //   }

  //   const centuries = Math.abs(Math.floor(newPos / 100));

  //   if (centuries !== 0) {
  //     console.log(
  //       `The dial is rotated ${line.text} to point at ${pos}; during this rotation, it points at 0 ${digitToAdverbial(centuries)}.`,
  //     );
  //     passesZeroDuringRotationCount += centuries;
  //   } else {
  //     console.log(`The dial is rotated ${line.text} to point at ${pos}`);
  //   }

  //   console.log("centuries:", centuries, "newPos:", newPos);
  // }

  let lineNumber = 0;
  for (const line of input.lines) {
    lineNumber++;

    const bruteForceResult = bruteForce(pos, line);

    passesZeroDuringRotationCount +=
      bruteForceResult.passesZeroDuringRotationCount;

    const smarterResult = smarterSolution(pos, line);

    if (smarterResult.pos !== bruteForceResult.pos) {
      throw new Error(
        `pos mismatch on line ${lineNumber}: smarterResult.pos=${smarterResult.pos} bruteForceResult.pos=${bruteForceResult.pos}`,
      );
    }

    if (
      smarterResult.passesZeroDuringRotationCount !==
      bruteForceResult.passesZeroDuringRotationCount
    ) {
      throw new Error(
        `passesZeroDuringRotationCount mismatch on line ${lineNumber}: smarterResult.passesZeroDuringRotationCount=${smarterResult.passesZeroDuringRotationCount} bruteForceResult.passesZeroDuringRotationCount=${bruteForceResult.passesZeroDuringRotationCount}`,
      );
    }

    pos = bruteForceResult.pos;
    if (pos === 0) {
      pointedAtZeroCount++;
    }

    console.log(`The dial is rotated ${line.text} to point at ${pos}`);
  }

  console.log(
    `
In this example, the dial points at 0 ${digitToAdverbial(pointedAtZeroCount)} at the end of a rotation, 
plus ${digitToAdverbial(passesZeroDuringRotationCount - pointedAtZeroCount)} during a rotation. So, in this example, the new 
password would be ${passesZeroDuringRotationCount}.
`,
  );
  return passesZeroDuringRotationCount;
}

function smarterSolution(pos: number, line: Input["lines"][0]) {
  let passesZeroDuringRotationCount = 0;
  let distanceFromZero;
  if (pos === 0) {
    distanceFromZero = 100;
  } else {
    distanceFromZero = line.dir === "L" ? pos : 100 - pos;
  }
  const distanceMovedPassedZero = line.steps - distanceFromZero;
  const passes =
    distanceMovedPassedZero > -1
      ? Math.ceil((distanceMovedPassedZero + 1) / 100)
      : 0;
  passesZeroDuringRotationCount += passes;

  const newPos = pos + line.normalized;

  pos = ((newPos % 100) + 100) % 100;

  return { pos, passesZeroDuringRotationCount };
}

function bruteForce(pos: number, line: Input["lines"][0]) {
  let passesZeroDuringRotationCount = 0;
  if (line.dir === "L") {
    for (let i = 1; i <= line.steps; i++) {
      pos--;
      if (pos < 0) {
        pos += 100;
      }
      if (pos === 0) {
        passesZeroDuringRotationCount++;
      }
    }
  } else {
    for (let i = 1; i <= line.steps; i++) {
      pos++;
      if (pos >= 100) {
        pos -= 100;
      }
      if (pos === 0) {
        passesZeroDuringRotationCount++;
      }
    }
  }

  return { pos, passesZeroDuringRotationCount };
}
