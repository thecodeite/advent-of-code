import { Sign } from "crypto";
import { Dir, Input, Map, Pos } from "./parse";

const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const Reset = "\x1b[0m";

`
  0123456789012345
          A>>>
0        ^...#^
1        ^.#..^
2        ^#...^
3 <<<A<<<D....B
4^...#.......#^
5^........#...^
6^..#....#....^
7G..........#.C>>>
8 <<<F<<<E...#....B
9        v.....#..v
0        v.#......v
1        v......#.v
          F>>>G>>>`;

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

const flip: Record<Dir, Dir> = {
  ">": "<",
  v: "^",
  "<": ">",
  "^": "v",
};
type Rotations = "L" | "R" | "F" | "S";

interface DirMap {
  "<"?: Dir;
  ">"?: Dir;
  "^"?: Dir;
  v?: Dir;
}

interface Edge {
  p: Pos;
  //rot: Rotations;
  dirMap: DirMap;
  l: string;
}
const edgeMap: Record<string, Edge> = {};

const edgeLength = 50;

// prettier-ignore
// addEdges([
//   [[[8,-1],  [11,-1]], [[3,3],  [0,3]],    'A'],  // A
//   [[[12,3],  [12,0]],  [[16,8], [16,11]],  'B'],  // B
//   [[[12,7],  [12,4]],  [[12,7], [15,7]],   'C'],  // C
//   [[[7,3],   [4,3]],   [[7,3],  [7,0]],    'D'],  // D
//   [[[7,8],   [7,11]],  [[7,8],  [4,8]],    'E'],  // E
//   [[[8,12],  [11,12]], [[3,8],  [0,8]],    'F'],  // F
//   [[[12,12], [15,12]], [[-1,7], [-1,4]],   'G'],  // G
// ])

const straightMap: DirMap = {
  '<':'<',
  '>':'>',
  '^':'^',
  'v':'v',
}
const flipMap: DirMap = {
  "<": ">",
  ">": "<",
  "^": "v",
  v: "^",
};

// // prettier-ignore
// addEdges([
//   [[[3,7],    [0,7]],    [[3,7],  [3,4]],    'A', true],  // A
//   [[[8,4],    [11,4]],   [[8,4],  [8,7]],    'B', false],  // B
//   [[[4,12],   [7,12]],   [[4,12], [4,15]],   'C', true],  // C
//   [[[12,3],   [12,0]],   [[8,8],  [8,11]],   'D', false],  // D
//   [[[-1,8],   [-1,11]],  [[3,3],  [3,0]],    'E', false],  // E
//   [[[7,-1],   [4,-1]],   [[-1,15],[-1,12]],  'F', true],  // F
//   [[[8,-1],   [11,-1]],  [[0,16], [3,16]],   'G', false],  // G
// ])

// 	-1)	(0	3)	(4	7)	(8	11)	(12
//	-1	0	  49	50	99	100	149	150
// prettier-ignore
addEdges([
  [[[49,99],    [0,99]],    [[49,99],  [49,50]],    'A', true],  // A
  [[[100,50],   [149,50]],  [[100,50], [100,99]],   'B', false],  // B
  [[[50,150],   [99,150]],  [[50,150], [50,199]],   'C', true],  // C
  [[[150,49],   [150,0]],   [[100,100],[100,149]],  'D', false],  // D
  [[[-1,100],   [-1,149]],  [[49,49],  [49,0]],     'E', false],  // E
  [[[99,-1],    [50,-1]],   [[-1,199], [-1,150]],   'F', true],  // F
  [[[100,-1],   [149,-1]],  [[0,200],  [49,200]],   'G', false],  // G
])

function addEdges(edges: [[Pos, Pos], [Pos, Pos], string, boolean][]) {
  edges.forEach(e => addEdge(e));
}
function addEdge([[aS, aE], [bS, bE], l, invert]: [
  [Pos, Pos],
  [Pos, Pos],
  string,
  boolean,
]) {
  const [adx, ady] = [aE[0] - aS[0], aE[1] - aS[1]];
  const [bdx, bdy] = [bE[0] - bS[0], bE[1] - bS[1]];
  // console.log("adx,ady:", adx, ady);
  // console.log("bdx,bdy:", bdx, bdy);

  function isCo(a: Dir, b: Dir) {
    return (
      (a === "<" && b === ">") ||
      (a === ">" && b === "<") ||
      (a === "^" && b === "v") ||
      (a === "v" && b === "^")
    );
  }

  let dirMap: DirMap = {};

  let aAlign: Dir;
  if (adx === 0) aAlign = ady > 0 ? "v" : "^";
  else if (ady === 0) aAlign = adx > 0 ? ">" : "<";
  else throw "non line";

  let bAlign: Dir;
  if (bdx === 0) bAlign = bdy > 0 ? "v" : "^";
  else if (bdy === 0) bAlign = bdx > 0 ? ">" : "<";
  else throw "non line";

  if (aAlign === bAlign) {
    dirMap = straightMap;
  } else if (isCo(aAlign, bAlign)) {
    dirMap = flipMap;
  } else {
    dirMap = {
      [aAlign]: flip[bAlign],
      [bAlign]: flip[aAlign],
    };
  }

  console.log({ l, aAlign, bAlign });
  // throw "stop";

  for (let p = 0; p < edgeLength; p++) {
    const a = {
      x: aS[0] + Math.sign(adx) * p,
      y: aS[1] + Math.sign(ady) * p,
    };

    const b = {
      x: bS[0] + Math.sign(bdx) * p,
      y: bS[1] + Math.sign(bdy) * p,
    };

    // console.log(a, "->", b);
    let rotA: Rotations;
    let rotB: Rotations;
    // if (rotDir === 0) {
    //   rotA = rotB = "S";
    // } else if (rotDir % 180 === 0) {
    //   rotA = rotB = "F";
    // } else if (rotDir === 90) {
    //   rotA = "R"; //Math.sign(ady) === Math.sign(bdx) ? "L" : "R";
    //   rotB = "L"; //Math.sign(ady) === Math.sign(bdx) ? "R" : "L";
    // } else if (rotDir === 270) {
    //   rotA = "L"; //Math.sign(ady) === Math.sign(bdx) ? "L" : "R";
    //   rotB = "R"; //Math.sign(ady) === Math.sign(bdx) ? "R" : "L";
    // } else {
    //   throw "e " + rotDir;
    // }

    // if (invert) {
    //   [rotA, rotB] = [rotB, rotA];
    // }

    const keyA = `${a.x},${a.y}`;
    const keyB = `${b.x},${b.y}`;

    // if (edgeMap[keyA]) {
    //   edgeMap[keyA].dirMap[bAlign] = flip[aAlign];
    // } else {
    edgeMap[keyA] = {
      p: [b.x, b.y],
      dirMap,
      l,
    };
    // }

    // if (edgeMap[keyB]) {
    //   edgeMap[keyB].dirMap[aAlign] = flip[bAlign];
    // } else {
    edgeMap[keyB] = {
      p: [a.x, a.y],
      dirMap,
      l,
    };
    //}

    //edgeMap[keyA] = { p: [b.x, b.y], rot: rotA, l };
    //edgeMap[keyB] = { p: [a.x, a.y], rot: rotB, l };
  }
}

const value: Record<Dir, number> = {
  ">": 0,
  v: 1,
  "<": 2,
  "^": 3,
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
): { map: Map; pos: Pos; dir: Dir } {
  let [px, py] = pos;
  let pDir = dir;

  const map = initialMap.map(row => [...row]);
  for (let m = 0; m < distance; m++) {
    let newDir = pDir;
    const [dx, dy] = deltaMap[newDir];
    map[py][px] = newDir;

    let [nx, ny] = [px + dx, py + dy];
    // console.log({ nx, ny, newDir });
    const next = map[ny]?.[nx] ?? " ";
    if (next === " ") {
      const key = `${nx},${ny}`;
      const wrap = edgeMap[key];
      if (!wrap) {
        console.log({ key, m, newDir });
        throw `missing: ` + key;
      }
      console.log("wrap:", { key, wrap, newDir, pDir, px, py });
      [nx, ny] = wrap.p;

      const mapped = wrap.dirMap[newDir];
      if (!mapped) {
        throw `wrap ${wrap.l} cant map ${newDir}`;
      }
      newDir = mapped;
      // if (wrap.rot === "S") {
      // } else if (wrap.rot === "F") {
      //   newDir = turnRight[turnRight[newDir]];
      // } else if (wrap.rot == "R") {
      //   newDir = turnRight[newDir];
      // } else if (wrap.rot == "L") {
      //   newDir = turnLeft[newDir];
      // } else {
      //   throw "not imp wrap.rot";
      // }

      const [idx, idy] = deltaMap[newDir];
      console.log({ idx, idy, newDir });
      [nx, ny] = [nx + idx, ny + idy];
    }

    // if (debug) console.log({ a: "pre ", nx, ny, next });
    // if (dir === ">") {
    //   if (!next || next === " " || nx >= map[ny].length) nx = findLeft(map[ny]);
    // }
    // if (dir === "<") {
    //   if (!next || next === " " || nx < 0) nx = findRight(map[ny]);
    // }
    // if (dir === "v") {
    //   if (!next || next === " " || ny >= map.length) ny = findTop(nx, map);
    // }
    // if (dir === "^") {
    //   if (!next || next === " " || ny < 0) ny = findBottom(nx, map);
    // }

    // console.log({ a: "post", nx, ny, next });
    if (map[ny][nx] === "#") break;
    px = nx;
    py = ny;
    pDir = newDir;
  }

  return { map, pos: [px, py], dir: pDir };
}

export function solve(input: Input) {
  const { map: initialMap, path } = input;

  const startY = input.start[1]; // 0; //findBottom(initialMap.length - 1, initialMap);
  const startX = findLeft(initialMap[startY]) + input.start[0];
  const startPos: Pos = [startX, startY];
  const startDir = input.dir;
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
      ({ map, pos, dir } = move(map, pos, dir, pathMove, debug));
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

/*
  guess: 197047
*/
