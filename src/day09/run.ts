import "../util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1 = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
const example2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
/* cSpell:enable */
let doReal = false;
doReal = true;

const lines = parse(doReal ? file : example2);

console.time("star1");
console.log("The solution to star 1 is:", solve1(lines));
console.timeEnd("star1");

console.time("star2");
console.log("The solution to star 2 is:", solve2(lines));
console.timeEnd("star2");
