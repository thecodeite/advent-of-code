import { Input } from "./parse";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const Reset = "\x1b[0m";

function lookAt(lines: number[][]) {
  const visible = lines.map(row => {
    const canSee = [row[0]];
    let map = ["#"];
    for (let i = 1; i < row.length; i++) {
      if (canSee.every(n => n < row[i])) {
        canSee.push(row[i]);
        map.push("#");
      } else {
        map.push(".");
      }
    }
    return map;
  });

  return visible;
}

export function solve(input: Input) {
  let { lines } = input;
  let results: any[] = [];
  for (let i = 0; i < 4; i++) {
    const res = lookAt(lines);
    results.push(res);
    results = results.map(res => res.rotateCW());
    lines = lines.rotateCW();
  }

  const merged: string[][] = [];
  for (let row = 0; row < input.lines.length; row++) {
    merged[row] = [];
    for (let col = 0; col < input.lines[row].length; col++) {
      merged[row][col] = ".";
      for (let r = 0; r < results.length; r++) {
        if (results[r][row][col] === "#") merged[row][col] = "#";
      }
    }
  }

  console.log(
    merged
      .map((r, iR) =>
        r
          .map((c, iC) =>
            c === "#"
              ? `${FgGreen}${input.lines[iR][iC]}${Reset}`
              : `${FgRed}${input.lines[iR][iC]}${Reset}`,
          )
          .join(""),
      )
      .join("\n"),
  );

  return merged.flatMap(r => r).filter(r => r === "#").length;
}
