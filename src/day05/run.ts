import "../util";
import * as fs from "node:fs/promises";
import { star1 } from "./star1";
import { star2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;
/* cSpell:enable */
let doReal = true;
// doReal = false;

const input = parse(doReal ? file : example);

star1(input);
star2(input);
