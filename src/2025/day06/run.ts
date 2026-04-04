import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse1, parse2 } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const pathToData = new URL(`./data.txt`, import.meta.url);
const file = await fs.readFile(pathToData, "utf8");

/* cSpell:disable */
const example1 = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`.slice(1, -1);
const example2 = example1;
/* cSpell:enable */
let doExample = true;

const input1 = parse1(doExample ? example1 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// Attempt 1: 15416420295 -> Too low
// Attempt 2: 4722948564882 -> Correct!

doExample = false;
const input2 = parse2(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");

// Attempt 1: 9581313737063 -> Correct! (0.206ms)
