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
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`.slice(1, -1);
const example2 = example1;
/* cSpell:enable */
let doExample = file.length === 0;

const input1 = parse(doExample ? example1 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// Attempt 1: 4782268188 -> Correct!

doExample = false;
const input2 = parse(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");

// Attempt 1: 2811792994 -> Too High
// Attempt 2: 1696309135 -> Too High
// Attempt 3: 1690376455 -> Too High
// Attempt 4: 1491313604 -> Unknown
// Attempt 5: 1574717268 -> Correct, but required reverse engineering due to a bug from come auto-complete.
// First attempt could have been correct but the bug was that I was calculating the area for the top key
// using the bottom key's x coordinate, instead of the top key's x coordinate. This caused the area to
// be calculated incorrectly for many points, which led to the wrong answer.
