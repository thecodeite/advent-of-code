import "../util";
import { expect, test } from "@jest/globals";
import * as fs from "node:fs/promises";
import { doRound, solve as solve1 } from "./star1";
import { format } from "node:util";
import { parse } from "./parse";

const calDate =
  process.env.CAL_DATE || `${new Date().getDate()}`.padStart(2, "0");

const output: string[] = [];
console.log = (str: string, ...param: any[]) => {
  output.push(format(str, ...param));
};
const expectedExample = (
  await fs.readFile(`./src/day${calDate}/expected-example.txt`, "utf8")
).split("\n");

/* cSpell:disable */
export const example = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;
/* cSpell:enable */

describe(`day ${calDate}`, () => {
  test("console output matches expected output", () => {
    output.length = 0;
    const input = parse(example);
    doRound(input.monkeys);

    expect(output).toEqual(expectedExample);
  });

  test("state after round1", () => {
    output.length = 0;
    const input = parse(example);
    doRound(input.monkeys);

    expect(input.monkeys.map(m => m.items)).toEqual([
      [20, 23, 27, 26],
      [2080, 25, 167, 207, 401, 1046],
      [],
      [],
    ]);
  });

  test("state after round2", () => {
    output.length = 0;
    const input = parse(example);
    doRound(input.monkeys);
    doRound(input.monkeys);

    expect(input.monkeys.map(m => m.items)).toEqual([
      [695, 10, 71, 135, 350],
      [43, 49, 58, 55, 362],
      [],
      [],
    ]);
  });

  test("state after round20", () => {
    output.length = 0;
    const input = parse(example);
    for (let i = 0; i < 20; i++) {
      doRound(input.monkeys);
    }

    expect(input.monkeys.map(m => m.items)).toEqual([
      [10, 12, 14, 26, 34],
      [245, 93, 53, 199, 115],
      [],
      [],
    ]);
  });

  test("inspections after round20", () => {
    output.length = 0;
    const input = parse(example);
    for (let i = 0; i < 20; i++) {
      doRound(input.monkeys);
    }

    expect(input.monkeys.map(m => m.inspections)).toEqual([
      101, //
      95,
      7,
      105,
    ]);
  });

  test("monkey business after round20", () => {
    output.length = 0;
    const input = parse(example);
    const monkeyBusiness = solve1(input);

    expect(monkeyBusiness).toEqual(10605);
  });
});
