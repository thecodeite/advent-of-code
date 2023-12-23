import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/2023/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1Web = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.slice(1, -1);
const example1SmallWeb = `
241343231
321545353
`.slice(1, -1);
const exampleTrick = `
19111
11191
99991
`.slice(1, -1);
const example1 = exampleTrick;
const example2 = example1;
/* cSpell:enable */
let doExample = file.length === 0;

const input1 = parse(doExample ? example1 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// doExample = true;
// const input2 = parse(doExample ? example2 : file);
// console.time("star2");
// console.log("The solution to star 2 is:", solve2(input2));
// console.timeEnd("star2");
