import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/2023/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1a = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
const example1b = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;
const example1 = example1b;
const example2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;
/* cSpell:enable */
let doExample = file.length === 0;
// doExample = true;

const input1 = parse(doExample ? example1 : file);
const input2 = parse(doExample ? example2 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");
