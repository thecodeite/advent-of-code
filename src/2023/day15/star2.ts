import { range } from "../../common/util";
import { Input, Lens } from "./parse";

export function solve(input: Input) {
  const { ops } = input;

  const boxes = range(256)
    .map(i => [i, [] as Lens[]] as const)
    .asEntries();

  // console.log("ops:", ops);

  ops.forEach(op => {
    if (op.op === "=") {
      const boxNumber = hash(op.lens.label);
      const box = boxes[boxNumber];
      const index = box.findIndex(l => l.label === op.lens.label);
      if (index === -1) {
        box.push(op.lens);
      } else {
        box[index] = op.lens;
      }
    } else if (op.op === "-") {
      const boxNumber = hash(op.label);
      const box = boxes[boxNumber];
      const index = box.findIndex(l => l.label === op.label);
      if (index !== -1) {
        box.splice(index, 1);
      }
    } else {
      throw new Error("Invalid op");
    }
  });

  const power = Object.entries(boxes)
    .map(([_, box], i) => {
      const boxPower = box.reduce(
        (acc, lens, j) => acc + lens.value * (j + 1),
        0,
      );
      return boxPower * (i + 1);
    })
    .sum();

  // console.log("power:", power);

  // console.log(
  //   "boxes:",
  //   Object.entries(boxes)
  //     .filter(([_, b]) => b.length > 0)
  //     .asEntries(),
  // );

  return power;
}

function hash(input: string) {
  return [...input].reduce(
    (acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256,
    0,
  );
}
4;

// 1st guess: 286278 Correct! (Took 1.7ms)
