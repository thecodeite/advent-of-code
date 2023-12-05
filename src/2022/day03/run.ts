import "../../common/util";
import * as fs from "node:fs/promises";
import { star1 } from "./star1";
import { star2 } from "./star2";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
/* cSpell:enable */
let doReal = true;
// doReal = false

const lines = (doReal ? file : example).split("\n");

star1(lines);
star2(lines);
