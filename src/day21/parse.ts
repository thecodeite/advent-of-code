export type MonkeyValue =
  | number
  | {
      lhs: string;
      op: string;
      rhs: string;
    };

export interface Monkey {
  id: string;
  value: MonkeyValue;
}

export interface Input {
  monkeys: Monkey[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");

  const monkeys = lines.map(line => {
    const [id, rest] = line.split(": ");

    const value = parseInt(rest);

    if (Number.isNaN(value)) {
      const [lhs, op, rhs] = rest.split(" ");
      return {
        id,
        value: { lhs, op, rhs },
      };
    } else {
      return { id, value };
    }
  });

  return { monkeys };
}
