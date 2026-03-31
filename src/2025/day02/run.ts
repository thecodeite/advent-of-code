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
11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124
`;
const example1a = `
2121212118-2121212124
`
  /* cSpell:enable */
  .slice(1, -1)
  .replace(/\n/g, "");
const example2 = example1;
let doExample = file.length === 0;

const input1 = parse(doExample ? example1 : file);

// Trying 29940924880 -> Correct
// console.time("star1");
// console.log("The solution to star 1 is:", solve1(input1));
// console.timeEnd("star1");

// doExample = true;
const input2 = parse(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");

// Trying 48631959042 -> Too high (Counted single-digit numbers, which can't be invalid and took 38h)
// Trying 48631958998 -> Correct
