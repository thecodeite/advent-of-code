import { Input } from "./parse";
const numbers = "0123456789".split("");

function isNumeric(str: string) {
  return numbers.includes(str);
}

function isSymbol(str: string) {
  return str !== "." && !isNumeric(str);
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

  const partNumbers: number[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = input.lines[y][x];
      if (isNumeric(char)) {
        const start = x;
        let length = 1;
        let numberValue = char;
        while (isNumeric(getChar(x + 1, y))) {
          numberValue += getChar(x + 1, y);
          x++;
          length++;
        }
        const above = getChunk(start - 1, y - 1, length + 2);
        const inline = getChunk(start - 1, y, length + 2);
        const below = getChunk(start - 1, y + 1, length + 2);

        // console.log("numberValue:", numberValue);
        // console.log(above);
        // console.log(inline);
        // console.log(below);

        const hasSymbol = [...(above + inline + below)].some(isSymbol);
        // console.log("hasSymbol:", hasSymbol);

        if (hasSymbol) {
          partNumbers.push(+numberValue);
        }
      }
    }
  }
  return partNumbers.sum();
}

// Tried: 521515.
// Correct answer: 521515
