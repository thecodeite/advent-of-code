import "../../common/util";
import * as fs from "node:fs/promises";
import { solve as solve1 } from "./star1";
import { solve as solve2 } from "./star2";
import { parse } from "./parse";
// import { host } from "../../common/host";
const calDate = process.env.CAL_DATE;

// host(`./src/2023/day${calDate}`, 2310);
console.log(`running day ${calDate}`);

const file = await fs.readFile(`./src/2023/day${calDate}/data.txt`, "utf8");
/* cSpell:disable */
const example1 = `.....
.S-7.
.|.|.
.L-J.
.....`;
const example2 = `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`;
const example3 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;
const example4 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;
const example5 = `
F-S--7.F----7
|...FJ.L7...|
|...L---J...|
|F7.......F7|
LJ|.......|LJ
..|.......|..
F7|.......|F7
|LJ.......LJ|
|...F---7...|
|...L7.FJ...|
L----J.L----J`.slice(1);
const example = example5;
/* cSpell:enable */
let doExample = file.length === 0;
// doExample = true;

const input1 = parse(doExample ? example : file);
const input2 = parse(doExample ? example : file);

// console.time("star1");
// console.log("The solution to star 1 is:", solve1(input1));
// console.timeEnd("star1");

console.time("star2");
console.log("The solution to star 2 is:", solve2(input2));
console.timeEnd("star2");
