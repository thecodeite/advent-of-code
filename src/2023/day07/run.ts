import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/2023/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1 = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
// KKKKK 1
// KKKKQ 2
// KKKQQ 3
// KKKQJ 4
// KKQQJ 5
// KKQJT 6
// KQJT9 7`;
const example2 = example1;
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
