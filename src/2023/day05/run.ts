import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
const calDate = process.env.CAL_DATE;

console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/2023/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1 = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;
const example2 = example1;
/* cSpell:enable */
let doExample = file.length === 0;
// doExample = true;

const input1 = parse(doExample ? example1 : file);
const input2 = parse(doExample ? example2 : file);

console.time("star1");
console.log("The solution to star 1 is:", solve1(input1));
console.timeEnd("star1");

// console.time("star2");
// console.log("The solution to star 2 is:", solve2(input2));
// console.timeEnd("star2");
