import "../../common/util";
import * as fs from "node:fs/promises";
import { star1 } from "./star1";
import { star2 } from "./star2";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
/* cSpell:enable */
let doReal = true;
// doReal = false

const lines = (doReal ? file : example).split("\n");

star1(lines);
star2(lines);
