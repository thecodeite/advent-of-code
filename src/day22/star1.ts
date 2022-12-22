import { Input, Map, Pos } from "./parse";

const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const Reset = "\x1b[0m";

type Dir = ">" | "v" | "<" | "^";
const dirs: Dir[] = [">", "v", "<", "^"];

const value: Record<Dir, number> = {
  ">": 0,
  v: 1,
  "<": 2,
  "^": 3,
};
const turnRight: Record<Dir, Dir> = {
  ">": "v",
  v: "<",
  "<": "^",
  "^": ">",
};

const turnLeft: Record<Dir, Dir> = {
  ">": "^",
  v: ">",
  "<": "v",
  "^": "<",
};

const deltaMap: Record<Dir, Pos> = {
  ">": [1, 0],
  v: [0, 1],
  "<": [-1, 0],
  "^": [0, -1],
};
const dirsVis: Record<Dir, string> = {
  ">": `${FgRed}→${Reset}`,
  v: `${FgRed}↓${Reset}`,
  "<": `${FgRed}←${Reset}`,
  "^": `${FgRed}↑${Reset}`,
};

function dump(map: string[][], pos: Pos, dir: Dir) {
  const [posX, posY] = pos;
  const o = [];
  const width = map.map(row => row.length).max();
  o.push("    ");
  for (let col = 0; col < width; col++) {
    const v = col > 0 && col % 100 === 0 ? col / 100 : " ";
    o.push(v.toString());
  }
  o.push("\n    ");
  for (let col = 0; col < width; col++) {
    const v = col > 0 && col % 10 === 0 ? (col / 10) % 10 : " ";
    o.push(v.toString());
  }
  o.push("\n    ");
  for (let col = 0; col < width; col++) {
    o.push((col % 10).toString());
  }
  o.push("\n\n");
  for (let row = 0; row < map.length; row++) {
    o.push(row.toString().padStart(3, " ") + " ");
    for (let col = 0; col < width; col++) {
      if (row === posY && col === posX) {
        o.push(dirsVis[dir]);
      } else {
        o.push(map[row][col]);
      }
    }
    o.push("\n");
  }
  o.push("\n");
  console.log(o.join(""));
}

function findLeft(mapRow: string[]) {
  return mapRow.findIndex(x => x !== " ");
}
function findRight(mapRow: string[]) {
  return mapRow.length - 1 - [...mapRow].reverse().findIndex(x => x !== " ");
}
function findTop(x: number, map: Map) {
  for (let row = 0; row < map.length; row++) {
    if (map[row].length >= x && map[row][x] !== " ") {
      return row;
    }
  }
  throw "err findTop";
}
function findBottom(x: number, map: Map) {
  for (let row = map.length - 1; row >= 0; row--) {
    // console.log({ op: "findBottom", row, x, at: map[row][x] });
    if (map[row].length >= x && map[row][x] !== " ") {
      return row;
    }
  }
  throw "err findBottom";
}

function move(
  initialMap: Map,
  pos: Pos,
  dir: Dir,
  distance: number,
  debug: boolean,
): { map: Map; pos: Pos } {
  let [px, py] = pos;
  const [dx, dy] = deltaMap[dir];
  const map = initialMap.map(row => [...row]);
  for (let m = 0; m < distance; m++) {
    map[py][px] = dir;

    let [nx, ny] = [px + dx, py + dy];

    const next = map[ny]?.[nx];
    if (debug) console.log({ a: "pre ", nx, ny, next });
    if (dir === ">") {
      if (!next || next === " " || nx >= map[ny].length) nx = findLeft(map[ny]);
    }
    if (dir === "<") {
      if (!next || next === " " || nx < 0) nx = findRight(map[ny]);
    }
    if (dir === "v") {
      if (!next || next === " " || ny >= map.length) ny = findTop(nx, map);
    }
    if (dir === "^") {
      if (!next || next === " " || ny < 0) ny = findBottom(nx, map);
    }
    if (debug) console.log({ a: "post", nx, ny, next });

    if (map[ny][nx] === "#") break;
    px = nx;
    py = ny;
  }

  return { map, pos: [px, py] };
}

export function solve(input: Input) {
  const { map: initialMap, path } = input;

  const startY = 0; //findBottom(initialMap.length - 1, initialMap);
  const startX = findLeft(initialMap[startY]);
  const startPos: Pos = [startX, startY];
  const startDir = ">";
  // dump(initialMap, startPos, startDir);
  let map = initialMap;
  let pos = startPos;
  let dir: Dir = startDir;
  // console.log("path:", path);
  // path[4] = (path[4] as number) + 1;
  const pEnd = /* */ path.length; //*/ 491;
  for (let p = 0; p < pEnd; p++) {
    const debug = false;
    const pathMove = path[p];
    if (typeof pathMove === "number") {
      if (debug) console.log(`Step ${p}: move ${pathMove} units`);
      ({ map, pos } = move(map, pos, dir, pathMove, debug));
    } else {
      if (debug) console.log(`Step ${p}: turn ${pathMove}`);
      if (pathMove == "R") dir = turnRight[dir];
      if (pathMove == "L") dir = turnLeft[dir];
    }
    if (debug) dump(map, pos, dir);
  }
  dump(map, pos, dir);

  const [col0, row0] = pos;
  const [col, row] = [col0 + 1, row0 + 1];
  const dirVal = value[dir];
  return [row, col, dirVal, row * 1000 + col * 4 + dirVal];
}
