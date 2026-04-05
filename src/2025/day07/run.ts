import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const pathToData = new URL(`./data.txt`, import.meta.url);
const file = await fs.readFile(pathToData, "utf8");

/* cSpell:disable */
const example1 = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`.slice(1, -1);
const example2 = example1;
/* cSpell:enable */
let doExample = false;

const input1 = parse(doExample ? example1 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// Attempt 1: 1690 -> Correct! (1.073ms)

doExample = false;
const input2 = parse(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");

// Attempt 1: 221371496188107 -> Correct! (2.02ms)
