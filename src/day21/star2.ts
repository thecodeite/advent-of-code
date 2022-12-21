import { Input, MonkeyValue } from "./parse";

export function solve(input: Input) {
  const asEntries = input.monkeys.map(
    m => [m.id, m.value] as [string, MonkeyValue],
  );
  const monkeys = Object.fromEntries(asEntries);

  function hasHumn(s: string): boolean {
    if (s === "humn") return true;
    const monkeyValue = monkeys[s];
    if (typeof monkeyValue !== "number") {
      return hasHumn(monkeyValue.lhs) || hasHumn(monkeyValue.rhs);
    }
    return false;
  }

  function resolve(monkeyValue: MonkeyValue): number {
    if (typeof monkeyValue === "number") {
      return monkeyValue;
    } else {
      const lhs = resolve(monkeys[monkeyValue.lhs]);
      const rhs = resolve(monkeys[monkeyValue.rhs]);

      const { op } = monkeyValue;

      if (op === "+") return lhs + rhs;
      if (op === "-") return lhs - rhs;
      if (op === "*") return lhs * rhs;
      if (op === "/") return lhs / rhs;

      throw op;
    }
    return 0;
  }

  const root = monkeys["root"] as {
    lhs: string;
    op: string;
    rhs: string;
  };

  monkeys["humn"] = 4;

  let test = Math.pow(2, 42);
  let d = test / 2;

  const humanSide = hasHumn(root.lhs) ? "lhs" : "rhs";
  const otherSide = humanSide === "rhs" ? "lhs" : "rhs";

  const target = resolve(monkeys[root[otherSide]]);
  while (d >= 1) {
    monkeys["humn"] = test;
    const withHuman = resolve(monkeys[root[humanSide]]);
    const diff = target - withHuman;

    if (diff > 0) {
      test -= d;
    } else {
      test += d;
    }
    d /= 2;
  }

  return monkeys["humn"];
}

// Tried 4348794605990n - too high
// Try 3848301405790
