import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;
/* cSpell:enable */
let doReal = false;
doReal = true;

const input = parse(doReal ? file : example);

console.time("star1");
console.log("The solution to star 1 is:", await solve1(input));
console.timeEnd("star1");

// guess 32067 - Wrong
// guess 32068 - Wrong
// guess 31705 - Wrong
console.time("star2");
console.log("The solution to star 2 is:", await solve2(input));
console.timeEnd("star2");
