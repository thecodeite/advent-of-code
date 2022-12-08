import { Input } from "./parse";

function lookAt(lines: number[][]) {
  // console.log(lines.map(row => row.join("")).join("\n"));
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

  // for (let i = 0; i < lines.length; i++) {
  //   console.log(lines[i].join(""), visible[i].join(""));
  // }
  // console.log(``);
  return visible;
}

export function solve(input: Input) {
  let { lines } = input;
  let results: any[] = [];

  results[0] = lookAt(lines);
  results[1] = lookAt(lines.rotateCW()).rotateACW();
  results[2] = lookAt(lines.map(r => r.reverseSafe())).map(r =>
    r.reverseSafe(),
  );
  results[3] = lookAt(lines.rotateACW()).rotateCW();

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

  // console.log(merged.map(r => r.join("")).join("\n"));

  return merged.flatMap(r => r).filter(r => r === "#").length;
}
