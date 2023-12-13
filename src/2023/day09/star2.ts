import { Input } from "./parse";

export function solve(input: Input) {
  const result = input.sets.map(set => {
    let firstDiff: number[] = [];
    let derivative: number[] = set;
    while (true) {
      derivative = calcDerivative(derivative);
      if (derivative.every(x => x === 0)) {
        break;
      }
      firstDiff.push(derivative[0]);
    }
    const topDiff = firstDiff.reduceRight((acc, cur) => cur - acc);

    const nextVal = set[0] - topDiff;
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

// 1st attempt: 1066 -> Correct! (took 0.9ms)
