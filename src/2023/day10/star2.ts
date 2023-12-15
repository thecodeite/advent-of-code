import { writeFileSync } from "fs";
import { Input } from "./parse";
//  x01234
//y0 .....
// 1 .F-7.
// 2 .|.|.
// 3 .L-J.
// 4 .....

interface Xy {
  x: number;
  y: number;
}

const cardinals = [
  { d: { x: 0, y: -1 }, m: ["|", "7", "F"] },
  { d: { x: 1, y: 0 }, m: ["-", "7", "J"] },
  { d: { x: 0, y: 1 }, m: ["|", "J", "L"] },
  { d: { x: -1, y: 0 }, m: ["-", "F", "L"] },
];

const neighbors = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
];

const moveMap: Record<string, Xy[]> = {
  "|": [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ],
  "-": [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ],
  F: [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
  L: [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
  ],
  J: [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ],
  "7": [
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ],
};

const insidesData = {
  F: "++",
  f: "0-;--;-0",
  L: "+-",
  l: "0+;-+;-0",
  J: "--",
  j: "0+;++;+0",
  "7": "-+",
  "1": "0-;+-;+0",
  ">": "0+",
  v: "-0",
  "<": "0-",
  "^": "+0",
};

const pol: Record<string, number> = { "-": -1, "+": 1, "0": 0 };
const insidesClockwise: Record<string, Xy[]> = Object.fromEntries(
  Object.entries(insidesData).map(([k, v]) => [
    k,
    v.split(";").map(s => ({ x: pol[s[0]], y: pol[s[1]] })),
  ]),
);

const insidesClockwiseX: Record<string, Xy[]> = {
  F: [{ x: 1, y: 1 }],
  f: [
    { x: -1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
  ],
  L: [{ x: 1, y: -1 }],
  l: [{ x: -1, y: 1 }],
  J: [{ x: -1, y: -1 }],
  j: [{ x: 1, y: 1 }],
  "7": [{ x: -1, y: 1 }],
  "1": [{ x: 1, y: -1 }],
  ">": [{ x: 0, y: 1 }],
  v: [{ x: -1, y: 0 }],
  "<": [{ x: 0, y: -1 }],
  "^": [{ x: 1, y: 0 }],
};

const insidesCounterClockwise: Record<string, Xy[]> = Object.fromEntries(
  Object.entries(insidesClockwise).map(([k, va]) => [
    k,
    va.map(v => ({ x: -v.x, y: -v.y })),
  ]),
);

function add(a: Xy, b: Xy): Xy {
  return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a: Xy, b: Xy): Xy {
  return { x: a.x - b.x, y: a.y - b.y };
}

function abs(a: Xy): Xy {
  return { x: Math.abs(a.x), y: Math.abs(a.y) };
}

function eq(a: Xy, b: Xy): boolean {
  return a.x === b.x && a.y === b.y;
}

export function solve(input: Input) {
  const { lines } = input;
  const width = lines[0].length;
  const height = lines.length;
  const result = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "."),
  );
  const inners = new Set<string>();
  let insides = insidesClockwise;
  const look = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return ".";
    }
    return lines[y][x];
  };
  const lookR = ({ x, y }: Xy) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return ".";
    }
    return result[y][x];
  };

  const f = ({ x, y }: Xy) => `${x},${y}`;
  const write = (at: Xy, char: string) => {
    const { x, y } = at;
    result[y][x] = char;
    // const d = insides[char];
    // const p = add(at, d);
    // // console.log({char, at:f(at), d:f(d), p:f(p)})
    // inners.add(f(p));
  };

  const addInsides = (at: Xy) => {
    const char = lookR(at);
    insides[char].forEach(d => {
      const p = add(at, d);
      // console.log({char, at:f(at), d:f(d), p:f(p)})
      inners.add(f(p));
    });
  };

  const findS = () => {
    for (let y = 0; y < height; y++) {
      const x = lines[y].indexOf("S");
      if (x !== -1) {
        return { x, y };
      }
    }
    throw new Error("no S found");
  };

  function calcChar(prev: Xy, at: Xy, next: Xy) {
    const delta = sub(next, prev);
    const prevChar = look(prev.x, prev.y);
    // console.log({ prevChar, delta });
    if (delta.x === 2 && delta.y === 0) {
      return ">";
    } else if (delta.x === -2 && delta.y === 0) {
      return "<";
    } else if (delta.x === 0 && delta.y === 2) {
      return "v";
    } else if (delta.x === 0 && delta.y === -2) {
      return "^";
    } else if (delta.x === 1 && delta.y === 1) {
      return at.x === prev.x ? "l" : "7";
    } else if (delta.x === 1 && delta.y === -1) {
      return at.y === prev.y ? "j" : "F";
    } else if (delta.x === -1 && delta.y === 1) {
      return at.y === prev.y ? "f" : "J";
      return "J";
    } else if (delta.x === -1 && delta.y === -1) {
      return at.x === prev.x ? "1" : "L";
      return "L";
    }
    return "*";
  }

  const start = findS();
  let at = start;
  const { x: startX, y: startY } = start;

  let nextMove = cardinals.find(({ d: { x, y }, m }) =>
    m.includes(look(startX + x, startY + y)),
  );
  if (!nextMove) {
    throw new Error("no next");
  }
  let next = add(start, nextMove.d);

  const endMove = cardinals
    .reverseSafe()
    .find(({ d: { x, y }, m }) => m.includes(look(startX + x, startY + y)));
  if (!endMove) {
    throw new Error("no end");
  }
  const end = add(start, endMove.d);

  write(start, calcChar(end, start, next));

  function move(from: Xy, at: Xy) {
    const charAt = look(at.x, at.y);
    //console.log({at, charAt});
    const moves = moveMap[charAt];
    if (!moves) throw new Error(`no moves ${f(from)} ${f(at)}`);
    const positions = moves.map(move => add(at, move));
    const nexts = positions.filter(p => !eq(p, from));
    if (nexts.length === 2) {
      throw new Error("from not in nexts");
    }
    return { nextPos: nexts[0], charAt };
  }
  let moveCount = 1;
  while (moveCount++ < 1000000 && !eq(next, end)) {
    const { nextPos, charAt } = move(at, next);
    write(next, calcChar(at, next, nextPos));
    at = next;
    next = nextPos;
  }
  write(end, calcChar(at, next, start));

  for (const row of result) {
    if (row.some(c => c === "<")) {
      insides = insidesCounterClockwise;
      break;
    } else if (row.some(c => c === ">")) {
      insides = insidesClockwise;
      break;
    }
  }

  result.forEach((row, y) => {
    row.forEach((_, x) => {
      if (result[y][x] !== ".") {
        addInsides({ x, y });
      }
    });
  });

  //const expandedResult = Array.from({length: height + 2}, (_, y) => Array.from({length: width + 2}, (_, x) => lookR({x:x-1,y:y-1})));

  function fill(s: Xy, result: string[][]) {
    const width = result[0].length;
    const height = result.length;

    const look = ({ x, y }: Xy) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return ".";
      }
      return result[y][x];
    };
    const paint = ({ x, y }: Xy) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return;
      }
      result[y][x] = "I";
    };

    function fillAt({ x, y }: Xy) {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return;
      }
      const charAt = look({ x, y });
      if (charAt !== ".") {
        return;
      }

      paint({ x, y });

      neighbors.forEach(d => {
        fillAt(add({ x, y }, d));
      });
    }

    fillAt(s);
  }

  [...inners]
    .map(f => f.split(",").map(Number))
    .forEach(([x, y]) => {
      fill({ x, y }, result);
    });
  // fill(result);
  const pretty1: Record<string, string> = {
    F: "╭",
    f: "┌",
    L: "╰",
    l: "└",
    "7": "╮",
    "1": "┐",
    J: "╯",
    j: "┘",
    ">": "─",
    v: "│",
    "<": "─",
    "^": "│",
  };
  const pretty2: Record<string, string> = {
    F: "▗",
    f: "▛",
    L: "▝",
    l: "▙",
    "7": "▖",
    "1": "▜",
    J: "▘",
    j: "▟",
    ">": "▄",
    v: "▌",
    "<": "▀",
    "^": "▐",
    // ".": "░",
    ".": " ",
    I: "▒",
  };
  const pretty = pretty2;

  const output = result
    .map(r => r.join(""))
    .join("\n")
    .replace(/./g, match => pretty[match] || match);
  writeFileSync("./src/2023/day10/output.txt", output);
  // console.log({inners});
  return [...result.join("")].filter(x => x === "I").length;
}

// 1st guess: 518 -> too low
// 2nd guess: 527 -> correct! (took 206ms)
