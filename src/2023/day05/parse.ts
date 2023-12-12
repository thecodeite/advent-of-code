import { assert } from "node:console";

export interface RangeMap {
  toStart: number;
  fromStart: number;
  length: number;
}

interface Section {
  from: string;
  to: string;
  maps: RangeMap[];
}

export interface Input {
  lines: string[];
  seeds: number[];
  sections: Section[];
}

function readNumbers(line: string): number[] {
  return [...line.matchAll(/(\d+)/g)].map(([, num]) => parseInt(num, 10));
}

function readRangeMap(line: string): RangeMap {
  const [toStart, fromStart, length] = readNumbers(line);
  return {
    toStart, fromStart, length
  };
}

function readSection(text: string): Section {
  const lines = text.split("\n");
  const header = lines.shift() || '';
  const [from, to] = header.split(" ")[0].split('-to-');
  const maps = lines.map(readRangeMap);
  return { from, to, maps };
}

export function parse(file: string): Input {
  const lines = file.split("\n");

  const seedsStr = lines.shift() || '';
  lines.shift();

  const seeds = readNumbers(seedsStr)

  const sections = lines.join("\n").split("\n\n").map(readSection);


  return {
    lines: [
      seeds.toString(),
      ...sections.map(x => JSON.stringify(x))
    ],
    seeds,
    sections,
  };
}
