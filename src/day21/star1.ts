import { Input, Monkey, MonkeyValue } from "./parse";

function resolve(
  monkeyValue: MonkeyValue,
  monkeys: Record<string, MonkeyValue>,
): number {
  if (typeof monkeyValue === "number") {
    return monkeyValue;
  } else {
    // console.log("monkeyValue:", monkeyValue);

    const lhs = resolve(monkeys[monkeyValue.lhs], monkeys);
    const rhs = resolve(monkeys[monkeyValue.rhs], monkeys);

    const { op } = monkeyValue;

    if (op === "+") return lhs + rhs;
    if (op === "-") return lhs - rhs;
    if (op === "*") return lhs * rhs;
    if (op === "/") return lhs / rhs;

    throw op;
  }
  return 0;
}

export function solve(input: Input) {
  const asEntries = input.monkeys.map(
    m => [m.id, m.value] as [string, MonkeyValue],
  );
  const monkeys = Object.fromEntries(asEntries);

  return resolve(monkeys["root"], monkeys);
  return monkeys;
}
