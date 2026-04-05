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
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`.slice(1, -1);
const example2 = example1;
/* cSpell:enable */
let doExample = file.length === 0;

const input1 = parse(doExample ? example1 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// Attempt 1: 122430 -> Correct! (399.036ms)

doExample = false;
const input2 = parse(doExample ? example2 : file);
console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");

// Attempt 1: 8135565324 -> Correct! (260.911ms)
