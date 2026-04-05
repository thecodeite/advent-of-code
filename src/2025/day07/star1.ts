import { Input } from "./parse";

export function solve(input: Input) {
  let map = input.lines.map(line => line.text.split(""));

  let splits = 0;
  printMap(map);

  for (let row = 0; row < map.length - 1; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let cell = map[row][col];
      let below = map[row + 1][col];

      if (cell === "S" || cell === "|") {
        if (below === ".") {
          map[row + 1][col] = "|";
        } else if (below === "^") {
          splits++;
          if (map[row + 1][col - 1] === ".") {
            map[row + 1][col - 1] = "|";
          }
          if (map[row + 1][col + 1] === ".") {
            map[row + 1][col + 1] = "|";
          }
        }
      }
    }

    printMap(map);
  }

  return splits;
}

function printMap(rows: string[][]) {
  return;
  console.log(rows.map(row => row.join("")).join("\n"), "\n");
}
