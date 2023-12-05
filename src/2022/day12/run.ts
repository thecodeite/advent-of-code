import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
/* cSpell:enable */
let doReal = false;
doReal = true;

const lines = parse(doReal ? file : example);
// console.log("lines:", lines.chart.heights["1,1"]);
console.time("star1");
console.log("The solution to star 1 is:", solve1(lines));
console.timeEnd("star1");

console.time("star2");
console.log("The solution to star 2 is:", solve2(lines));
console.timeEnd("star2");
