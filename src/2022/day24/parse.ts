import { Vector } from "../Vector";

export interface Blizzard {
  pos: Vector;
  dir: `^` | ">" | "v" | "<";
}

export interface Board {
  blizzards: Blizzard[];
  start: Vector;
  finish: Vector;
  width: number;
  height: number;
}

export type Input = Board;

export interface State extends Input {
  pos?: Vector;
}

export function dump(state: Board, ...pos: Vector[]) {
  const o: string[] = [];

  o.push("     ");
  for (let col = 0; col <= state.width - 1; col++) {
    // if (col === 0) {
    //   o.push("|");
    //   continue;
    // }
    const v = col > 0 && col % 100 === 0 ? col / 100 : " ";
    o.push(v.toString());
  }
  o.push("\n     ");
  for (let col = 0; col <= state.width - 1; col++) {
    // if (col === 0) {
    //   o.push("|");
    //   continue;
    // }
    const val = Math.abs(col);
    const v = val > 0 && val % 10 === 0 ? (val / 10) % 10 : " ";
    o.push(v.toString());
  }
  o.push("\n     ");
  for (let col = 0; col <= state.width - 1; col++) {
    o.push((Math.abs(col) % 10).toString());
  }
  o.push("\n    #");
  for (let col = 0; col <= state.width - 1; col++) {
    if (pos.some(p => col === p.x && p.y === -1)) {
      o.push("E");
    } else if (col === state.start.x) {
      o.push(".");
    } else {
      o.push("#");
    }
  }
  o.push("#\n");

  for (let row = 0; row <= state.height - 1; row++) {
    o.push(row.toString().padStart(3, " ") + " #");
    for (let col = 0; col <= state.width - 1; col++) {
      const b = state.blizzards.filter(b => b.pos.x === col && b.pos.y === row);
      if (pos.some(p => col === p.x && row === p.y)) o.push("E");
      else if (b.length === 1) o.push(b[0].dir);
      else if (b.length > 1) o.push(b.length.toString());
      // else if (state.pos && state.pos.eq({ x: col, y: row })) o.push("E");
      else o.push(".");
    }
    o.push("#\n");
  }

  o.push("    #");
  for (let col = 0; col <= state.width - 1; col++) {
    if (pos.some(p => col === p.x && p.y === state.height)) {
      o.push("E");
    } else if (col === state.finish.x) {
      o.push(".");
    } else {
      o.push("#");
    }
  }
  o.push("#\n");

  console.log(o.join(""));
}

export function parse(file: string): Input {
  const lines = file
    // .replace(/[\^v<>]/g, ".") //
    .split("\n");

  const [top, ...rest] = lines;
  const [bottom, ...mid] = rest.reverse();
  mid.reverse();

  const width = top.length - 2;
  const height = mid.length;

  const start = new Vector(top.indexOf(".") - 1, -1);
  const finish = new Vector(bottom.indexOf(".") - 1, height);

  const blizzards = mid.flatMap((lineStr, row) => {
    const [, ...line] = lineStr;
    line.length--;
    // console.log("line:", line);
    return line.flatMap((dir, col) =>
      dir === "." ? [] : [{ pos: new Vector(col, row), dir } as Blizzard],
    );
  });

  return { blizzards, start, finish, width, height };
}
