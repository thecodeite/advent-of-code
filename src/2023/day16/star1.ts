import { trace } from "console";
import { Vector } from "../../common/Vector";
import { Input } from "./parse";

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
  const moveList = [{ pos: new Vector(0, 0), dir: ">" }] as Move[];

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

// 1st guess: 7543 -> Correct! (took 7ms)
