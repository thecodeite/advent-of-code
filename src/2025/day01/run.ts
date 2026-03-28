import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/2025/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1 = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
`.slice(1, -1);
const example2 = example1;
/* cSpell:enable */
let doExample = file.length === 0;

const input1 = parse(doExample ? example1 : file);

// console.time("star1");
// console.log("The solution to star 1 is:", solve1(input1));
// console.timeEnd("star1");

// Trued: 6680 -> Too high
// Trued: 6634 - Correct!

// doExample = true;
const input2 = parse(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");
