import { Input } from "./parse";

export function solve(input: Input) {
  const result = input.sets.map(set => {
    let lastDiff: number[] = [];
    let derivative: number[] = set;
    while (true) {
      derivative = calcDerivative(derivative);
      if (derivative.every(x => x === 0)) {
        break;
      }
      lastDiff.push(derivative[derivative.length - 1]);
    }
    const topDiff = lastDiff.reduceRight((acc, cur) => cur + acc);

    const nextVal = set[set.length - 1] + topDiff;

    return nextVal;
  });
  return result.sum();
}

function calcDerivative(set: number[]) {
  const result = [];
  for (let i = 0; i < set.length - 1; i++) {
    result.push(set[i + 1] - set[i]);
  }
  return result;
}

// 1st attempt: 1762065988 -> Correct! (took 1.2ms)
