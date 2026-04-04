import "../../common/util";
import * as fs from "node:fs/promises";
import { solve1 } from "./star2";
import { solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const pathToData = new URL(`./data.txt`, import.meta.url);
const file = await fs.readFile(pathToData, "utf8");

/* cSpell:disable */
const example1 = `
3-5
10-14
16-20
12-18

1
5
8
11
17
32
`.slice(1, -1);

/* cSpell:enable */
const example2 = example1;
let doExample = file.length === 0;

const input1 = parse(doExample ? example1 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// First attempt: 739 -> Correct! (2.161ms)

// doExample = true;
const input2 = parse(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");

// First attempt: 344486348901788 -> Correct! (0.055ms)
