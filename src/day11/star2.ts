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

  const modulo = monkeys.map(m => m.test).product();

  Array.from({ length: 10000 }).forEach(() => doRound(monkeys, modulo));

  const [a, b] = input.monkeys.map(m => m.inspections).sort((a, b) => b - a);

  return [a, b, a * b];
}

export function doRound(monkeys: Monkey[], modulo: number) {
  monkeys.forEach(monkey => {
    const { op, test, ifTrue, ifFalse } = monkey;

    monkey.items.forEach(item => {
      let worry = doOp(op, item);
      worry = worry % modulo;
      const isDiv = worry % test === 0;

      const target = isDiv ? ifTrue : ifFalse;
      monkey.inspections++;
      monkeys[target].items.push(worry);
    });
    monkey.items = [];
  });
}
