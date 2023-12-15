import { Input } from "./parse";
//  x01234
//y0 .....
// 1 .F-7.
// 2 .|.|.
// 3 .L-J.
// 4 .....

interface Xy {x:number,y:number} 

const cardinals = [
  {d: {x:0, y:-1}, m:['|', '7', 'F']},
  {d: {x:1, y:0}, m: ['-','7','J']},
  {d: {x:0, y:1}, m: ['|','J','L',]},
  {d: {x:-1, y:0}, m: ['-','F','L']},
];

const moveMap: Record<string, Xy[]> = {
  '|': [{x:0, y:1}, {x:0, y:-1}],
  '-': [{x:1, y:0}, {x:-1, y:0}],
  'F': [{x:1, y:0}, {x:0, y:1}],
  'L': [{x:0, y:-1}, {x:1, y:0}],
  'J': [{x:0, y:-1}, {x:-1, y:0}],
  '7': [{x:0, y:1}, {x:-1, y:0}],
}

function add(a: Xy, b: Xy): Xy {
  return {x: a.x + b.x, y: a.y + b.y};
}

function eq(a: Xy, b: Xy): boolean {
  return a.x === b.x && a.y === b.y;
}

export function solve(input: Input) {
  const {lines} = input
  const width = lines[0].length;
  const height = lines.length;
  const look = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return '.';
    }
    return lines[y][x];
  }

  const findS = () => {
    for (let y = 0; y < height; y++) {
      const x = lines[y].indexOf('S');
      if (x !== -1) {
        return {x, y};
      }
    }
    throw new Error('no S found');
  }

  const start = findS();
  let at = start;
  const {x:startX, y:startY} = start;

  let nextMove = cardinals.find(({d:{x, y}, m}) => m.includes(look(startX + x, startY + y)));
  if (!nextMove) {
    throw new Error('no next');
  }
  let next = add(start, nextMove.d)

  const endMove = cardinals.reverseSafe().find(({d:{x, y}, m}) => m.includes(look(startX + x, startY + y)));
  if (!endMove) {
    throw new Error('no end');
  }
  const end = add(start, endMove.d );

  function move(from: Xy, at: Xy) {
    const charAt = look(at.x, at.y);
    //console.log({at, charAt});
    const moves = moveMap[charAt];
    if (!moves) throw new Error('no moves');
    const positions = moves.map(move => add(at, move));
    const nexts = positions.filter((p => !eq(p, from)));
    if (nexts.length === 2) {
      throw new Error('from not in nexts');
    }
    return nexts[0]
  }
  let moveCount = 1;
  while(moveCount++ < 1000000 && !eq(next, end)) {
    const nextAt = next;
    next = move(at, next);
    at = nextAt;
  } 
  return moveCount / 2;
}

// 1st try: 6812 -> Correct! (took 21ms)