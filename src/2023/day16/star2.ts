import { trace } from "console";
import { Vector } from "../../common/Vector";
import { Input } from "./parse";
import { range } from "../../common/util";

const right = new Vector(1, 0);
const left = new Vector(-1, 0);
const up = new Vector(0, -1);
const down = new Vector(0, 1);

type Direction = ">" | "<" | "^" | "v";
type Next = Record<Direction, Direction[]>;
interface Move {
  pos: Vector;
  dir: Direction;
}
const directionMap: Record<Direction, Vector> = {
  ">": right,
  "<": left,
  "^": up,
  v: down,
};

export function solve(input: Input) {
  const topRow: Move[] = range(input.lines[0].length).map(i => ({
    pos: new Vector(i, 0),
    dir: "v",
  }));
  const bottomRow: Move[] = range(input.lines[0].length).map(i => ({
    pos: new Vector(i, input.lines.length - 1),
    dir: "^",
  }));
  const leftColumn: Move[] = range(input.lines.length).map(i => ({
    pos: new Vector(0, i),
    dir: ">",
  }));
  const rightColumn: Move[] = range(input.lines.length).map(i => ({
    pos: new Vector(input.lines[0].length - 1, i),
    dir: "<",
  }));
  const starts = [...topRow, ...bottomRow, ...leftColumn, ...rightColumn];

  const solutions = starts.map(move => solveFor(input, move));
  // console.log("solutions:", solutions);
  return solutions.max();
}

export function solveFor(input: Input, initialMove: Move) {
  const height = input.lines.length;
  const width = input.lines[0].length;
  const look = (pos: Vector) => {
    if (pos.x < 0 || pos.y < 0 || pos.x >= width || pos.y >= height) {
      return "W";
    }
    return input.lines[pos.y][pos.x];
  };

  const canvas = input.lines.map(line => Array.from(line, () => "."));
  const dumpCanvas = () => {
    console.log(canvas.map(c => c.join("")).join("\n"));
  };
  const paint = (pos: Vector) => {
    if (pos.x < 0 || pos.y < 0 || pos.x >= width || pos.y >= height) {
      return;
    }
    canvas[pos.y][pos.x] = "#";
  };

  const visited = new Set<string>();
  const moveList = [initialMove] as Move[];

  const traceBeam = (pos: Vector, dir: Direction) => {
    const key = `${pos.x},${pos.y},${dir}`;
    if (visited.has(key)) return;
    visited.add(key);
    const at = look(pos);
    if (at === "W") return; //Stop
    paint(pos);

    const go = (...dirs: Direction[]) =>
      dirs.forEach(dir =>
        moveList.push({ pos: pos.add(directionMap[dir]), dir }),
      );

    if (at === ".") {
      go(dir);
      return;
    } else if (at === "s" || at === "\\") {
      const map: Next = {
        ">": ["v"],
        "<": ["^"],
        "^": ["<"],
        v: [">"],
      };
      go(...map[dir]);
    } else if (at === "/") {
      const map: Next = {
        ">": ["^"],
        "<": ["v"],
        "^": [">"],
        v: ["<"],
      };
      go(...map[dir]);
    } else if (at === "-") {
      const map: Next = {
        ">": [">"],
        "<": ["<"],
        "^": ["<", ">"],
        v: ["<", ">"],
      };
      go(...map[dir]);
    } else if (at === "|") {
      const map: Next = {
        ">": ["^", "v"],
        "<": ["^", "v"],
        "^": ["^"],
        v: ["v"],
      };
      go(...map[dir]);
    } else {
      throw new Error("unknown: " + at);
    }
  };

  while (moveList.length > 0) {
    const { pos, dir } = moveList.shift()!;
    traceBeam(pos, dir);
  }

  // dumpCanvas();
  return canvas.flatMap(line => line.filter(c => c === "#")).length;
}

// 1st guess: 8231 -> Correct! (took 907ms)
