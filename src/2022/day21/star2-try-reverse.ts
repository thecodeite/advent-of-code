import { Input, Monkey, MonkeyValue } from "./parse";

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

  function reverseResolve(
    monkeyValue: MonkeyValue,
    over: bigint,
    under: bigint,
  ): bigint {
    console.log("rr", monkeyValue);
    if (typeof monkeyValue === "number") {
      throw "rr error";
    } else {
      const humnSide = hasHumn(monkeyValue.lhs) ? "lhs" : "rhs";
      const mnkySide = humnSide === "lhs" ? "rhs" : "lhs";

      const value = BigInt(resolve(monkeys[monkeyValue[mnkySide]]));

      const { op } = monkeyValue;
      let reverseOver: bigint;
      let reverseUnder: bigint;
      if (op === "+") {
        reverseOver = over - value * under;
        reverseUnder = under;
      } else if (op === "-") {
        reverseOver = over + value * under;
        reverseUnder = under;
      } else if (op === "*") {
        reverseOver = over;
        reverseUnder = under * value;
      } else if (op === "/") {
        if (under % value === 0n) {
          reverseOver = over;
          reverseUnder = under / value;
        } else {
          reverseOver = over * value;
          reverseUnder = under;
        }
      } else throw op;

      console.log(
        `${over}/${under} =  ${value} ${op} ${reverseOver}/${reverseUnder}`,
      );
      let fr = undefined as [number, number] | undefined;
      // if (reverse % 1 !== 0) {
      //   fr = [target % value, value];
      // }

      if (monkeyValue[humnSide] === "humn") {
        return reverseOver / reverseUnder;
      } else {
        return reverseResolve(
          monkeys[monkeyValue[humnSide]],
          reverseOver,
          reverseUnder,
        );
      }
      // const lhs = resolve(monkeys[monkeyValue.lhs]);
      // const rhs = resolve(monkeys[monkeyValue.rhs]);

      // const { op } = monkeyValue;

      // if (op === "+") return lhs + rhs;
      // if (op === "-") return lhs - rhs;
      // if (op === "*") return lhs * rhs;
      // if (op === "/") return lhs / rhs;

      // throw op;
    }
    return 0n;
  }

  const root = monkeys["root"] as {
    lhs: string;
    op: string;
    rhs: string;
  };

  monkeys["humn"] = 4;

  let test = Math.pow(2, 42);
  let d = test / 2;

  const rhs = resolve(monkeys[root.rhs]);
  while (d >= 1) {
    monkeys["humn"] = test;
    const lhs = resolve(monkeys[root.lhs]);
    const diff = rhs - lhs;
    console.log({ test, diff });
    if (diff > 0) {
      test -= d;
    } else {
      test += d;
    }
    d /= 2;
  }

  // if (hasHumn(root.lhs)) {
  //   const target = resolve(monkeys[root.rhs]);
  //   return reverseResolve(monkeys[root.lhs], BigInt(target), 1n);
  // } else {
  //   const target = resolve(monkeys[root.lhs]);
  //   return reverseResolve(monkeys[root.rhs], BigInt(target), 1n);
  //   console.log(`human on right`);
  // }

  //return resolve(monkeys["root"]);
  //return monkeys;
}

// Tried 4348794605990n - too high
// Try 3848301405790
