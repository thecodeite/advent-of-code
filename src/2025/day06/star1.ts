import { Input1 } from "./parse";

export function solve(input: Input1) {
  let total = 0;

  input.operations.forEach((operation, columnIndex) => {
    const action = input.operations[columnIndex];
    const values = input.lines.map(line => line.columns[columnIndex]);

    if (action.symbol === "*") {
      const subTotal = values.reduce((acc, val) => acc * val, 1);
      // console.log(`subTotal: ${values.join(" * ")} =`, subTotal);
      total += subTotal;
    } else {
      const subTotal = values.reduce((acc, val) => acc + val, 0);
      // console.log(`subTotal: ${values.join(" + ")} =`, subTotal);
      total += subTotal;
    }
  });

  return total;
}
