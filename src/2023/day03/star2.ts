import { Input } from "./parse";
const numbers = "0123456789".split("");

function isNumeric(str: string) {
  return numbers.includes(str);
}

function isSymbol(str: string) {
  return str !== "." && !isNumeric(str);
}

function isGear(str: string) {
  return str === "*";
}

function f<T>(x: T | undefined): x is T {
  return x !== undefined;
}

export function solve(input: Input) {
  const width = input.lines[0].length;
  const height = input.lines.length;

  const getChar = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return ".";
    }
    return input.lines[y][x];
  };

  const getChunk = (x: number, y: number, length: number) => {
    let chunk = "";
    for (let i = 0; i < length; i++) {
      chunk += getChar(x + i, y);
    }
    return chunk;
  };

  const getGear = (row: number, start: number) => (char: string, i: number) => {
    if (isGear(char)) {
      return `${i + start},${row}`;
    }
  };

  const rearRatios: number[] = [];
  const foundGears: Record<string, number[]> = {};

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = input.lines[y][x];
      if (isNumeric(char)) {
        const start = x - 1;
        let length = 3;
        let numberValue = char;
        while (isNumeric(getChar(x + 1, y))) {
          numberValue += getChar(x + 1, y);
          x++;
          length++;
        }
        const above = getChunk(start, y - 1, length);
        const line = getChunk(start, y, length);
        const below = getChunk(start, y + 1, length);

        // console.log("numberValue:", numberValue);
        // console.log(above);
        // console.log(line);
        // console.log(below);
        // console.log(`-----------------`);
        const aboveGears = [...above].map(getGear(y - 1, start)).filter(f);
        const lineGears = [...line].map(getGear(y, start)).filter(f);
        const belowGears = [...below].map(getGear(y + 1, start)).filter(f);
        // console.log(aboveGears);
        // console.log(lineGears);
        // console.log(belowGears);
        const allGears = [...aboveGears, ...lineGears, ...belowGears];
        // console.log(allGears);

        allGears.forEach(gear => {
          foundGears[gear] = [...(foundGears[gear] || []), +numberValue];
        });
      }
    }
  }
  // console.log(" foundGears:", foundGears);
  return Object.values(foundGears)
    .filter(gears => {
      if (gears.length > 2) {
        throw new Error("too many gears");
      }
      return gears.length === 2;
    })
    .map(gears => gears.product())
    .sum();
}

// Trying: 69527306
// Correct answer: 69527306
