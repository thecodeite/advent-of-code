import "../util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;
/* cSpell:enable */
let doReal = false;
doReal = true;

const input = parse(doReal ? file : example);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input));
console.timeEnd("star1");

// console.time("star2");
// console.log("The solution to star 2 is:", solve2(input));
// console.timeEnd("star2");
