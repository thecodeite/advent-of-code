import { Vector } from "../Vector";

export enum Cardinals {
  N = "N",
  S = "S",
  W = "W",
  E = "E",
}

export enum Diags {
  NW = "NW",
  SW = "SW",
  SE = "SE",
  NE = "NE",
}

export type Compass = Cardinals | Diags;

export interface Elf {
  location: Vector;
  proposed?: Vector;
  h: boolean;
  id: string;
}

export interface Input {
  elves: Elf[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");
  const elves: Elf[] = [];
  const hx = 0; //Math.floor(lines[0].length / 2);
  const hy = 0; //Math.floor(lines[0].length / 2);

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const char = lines[row][col];
      if (char !== ".") {
        const elf = {
          location: new Vector(col - hx, row - hy),
          h: false,
          id: char,
        };
        elves.push(elf);
      }
    }
  }
  return { elves };
}
