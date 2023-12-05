import { Input, Monkey } from "./parse";

const wordMap: Record<"*" | "+", string> = {
  "*": "is multiplied",
  "+": "increases",
};

function doOp(op: Monkey["op"], old: number) {
  if (op.action === "*") return old * (op.amount ?? old);
  if (op.action === "+") return old + (op.amount ?? old);
  throw "error";
}

export function solve(input: Input) {
  const monkeys = [...input.monkeys];

  Array.from({ length: 20 }).forEach(() => doRound(monkeys));

  const [a, b] = input.monkeys.map(m => m.inspections).sort((a, b) => b - a);

  return a * b;
}

export function doRound(monkeys: Monkey[]) {
  monkeys.forEach(monkey => {
    const { op, test, ifTrue, ifFalse } = monkey;
    const { action, amount } = op;

    // console.log(`Monkey ${monkey.id}:`);
    monkey.items.forEach(item => {
      // console.log(`  Monkey inspects an item with a worry level of ${item}.`);
      let worry = doOp(op, item);
      // console.log(
      //   `    Worry level ${wordMap[action]} by ${
      //     amount ?? "itself"
      //   } to ${worry}.`,
      // );
      worry = Math.floor(worry / 3);
      // console.log(
      //   `    Monkey gets bored with item. Worry level is divided by 3 to ${worry}.`,
      // );
      const isDiv = worry % test === 0;

      const target = isDiv ? ifTrue : ifFalse;
      // console.log(
      //   `    Current worry level is${
      //     isDiv ? "" : " not"
      //   } divisible by ${test}.`,
      // );
      // console.log(
      //   `    Item with worry level ${worry} is thrown to monkey ${target}.`,
      // );
      monkey.inspections++;
      monkeys[target].items.push(worry);
    });
    monkey.items = [];
  });
}
