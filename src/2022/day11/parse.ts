export interface Monkey {
  id: number;
  items: number[];
  op: {
    action: "*" | "+";
    amount: number | null;
  };
  test: number;
  ifTrue: number;
  ifFalse: number;
  inspections: number;
}

export interface Input {
  monkeys: Monkey[];
}

function parseOp(opStr: string): {
  action: "*" | "+";
  amount: number | null;
} {
  const [opLStr, opSStr, opRStr] = opStr
    .trimStart()
    .stripPrefix("Operation: new = ")
    .split(" ");
  if (opSStr !== "*" && opSStr !== "+") throw "opp " + opSStr;
  const opL = opLStr === "old" ? null : parseInt(opLStr);
  const action = opSStr as "*" | "+";
  const opR = opRStr === "old" ? null : parseInt(opRStr);

  if (opL === null && opR === null) return { action, amount: null };
  else if (opL === null && opR !== null) return { action, amount: opR };
  else if (opL !== null && opR === null) return { action, amount: opL };
  else throw "never";
}

function parseMonkey(str: string): Monkey {
  const [idStr, itemsStr, opStr, testStr, trueStr, falseStr] = str
    .split("\n")
    .map(s => s.trimStart());

  const id = parseInt(idStr.stripPrefix("Monkey ").stripPostfix(":"));
  const items = itemsStr
    .stripPrefix("Starting items: ")
    .split(", ")
    .map(s => parseInt(s));
  const op = parseOp(opStr);
  const test = parseInt(testStr.stripPrefix("Test: divisible by "));
  const ifTrue = parseInt(trueStr.stripPrefix("If true: throw to monkey "));
  const ifFalse = parseInt(falseStr.stripPrefix("If false: throw to monkey "));

  return {
    id,
    items,
    op,
    test,
    ifTrue,
    ifFalse,
    inspections: 0,
  };
}

export function parse(file: string): Input {
  const monkeys = file.split("\n\n").map(parseMonkey);
  return { monkeys };
}
