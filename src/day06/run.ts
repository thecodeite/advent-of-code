import "../util";
import * as fs from "node:fs/promises";
import { star1 } from "./star1";
import { star2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1 = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`; // 7
const example2 = `bvwbjplbgvbhsrlpgdmjqwftvncz`; //5
const example3 = `nppdvjthqldpwncqszvftbrmjlhg`; //6
const example4 = `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`; //10
const example5 = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`; //11

const example6 = "mjqjpqmgbljsphdztnvjfqwrcgsmlb"; // 19
const example7 = "bvwbjplbgvbhsrlpgdmjqwftvncz"; // 23
const example8 = "nppdvjthqldpwncqszvftbrmjlhg"; // 23
const example9 = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"; // 29
const example0 = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"; // 26

const example = example0;
/* cSpell:enable */
let doReal = false;
doReal = true;

const lines = parse(doReal ? file : example);

star1(lines);
star2(lines);
