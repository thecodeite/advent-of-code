import { Vector } from "../Vector";
import { Board, dump, Input } from "./parse";

interface Path {
  pos: Vector;
  pre?: Path;
}

export function solve(input: Input) {
  const initialState = { ...input, pos: input.start };

  let board: Board = input;
  // let { pos } = initialState;
  // pos = pos.add({ x: 0, y: 1 });
  // dump(initialState);
  // for (let i = 0; i < 5; i++) {
  //   board = nextBoard(board);
  //   dump({ ...board, pos });
  //   pos = pos.add({ x: 1, y: 1 });
  // }
  // pos = pos.add({ x: -1, y: 0 });
  // console.log("pos:", pos);
  // dump({ ...board, pos });

  let positions: Path[] = [{ pos: input.start }];
  let move = 0;
  let winner = undefined as Path | undefined;
  do {
    // dump(board);
    board = nextBoard(board);
    positions = calcNextPositions(board, positions);
    // console.log("positions:", positions);
    move++;
    // console.log("move:", move, positions.length);
    winner = positions.find(p => p.pos.eq(input.finish));
  } while (!winner && move < 1000);

  const validPath = winner && replay(winner);

  // console.log("validPath:", validPath);
  // validPath && dump({ ...board }, ...validPath);
  // console.log("finish:", input.finish);

  return move;
}

function replay(path: Path): Vector[] {
  if (path.pre) return [path.pos, ...replay(path.pre)];
  else return [path.pos];
}

function calcNextPositions(board: Board, positions: Path[]): Path[] {
  const { width, height, start, finish } = board;
  // const possible: Path[] = [];
  const checked: number[] = [];
  const startI = start.toI(width);
  const finishI = finish.toI(width);

  return positions.flatMap(p => {
    const candidates: Path[] = [
      { pos: p.pos, pre: p },
      { pos: p.pos.down(), pre: p },
      { pos: p.pos.right(), pre: p },
      { pos: p.pos.left(), pre: p },
      { pos: p.pos.up(), pre: p },
    ];

    // // possible.push({ pos: p.pos, pre: p });
    // possible.push({ pos: p.pos.up(), pre: p });
    // possible.push({ pos: p.pos.down(), pre: p });
    // possible.push({ pos: p.pos.left(), pre: p });
    // possible.push({ pos: p.pos.right(), pre: p });

    const possible = candidates.filter(p => {
      const { pos } = p;
      const i = pos.toI(width);
      if (checked.includes(i)) return false;
      checked.push(i);
      if (i === startI) return true;
      if (i === finishI) return true;
      const { x, y } = pos;
      if (x < 0) return false;
      if (y < 0) return false;
      if (x > width) return false;
      if (y >= height) return false;
      if (board.blizzards.some(b => pos.eq(b.pos))) return false;
      return true;
    });

    return possible;
    // if (possible.length === 0) throw "dead";

    //return possible.length > 0 ? possible : [{ pos: p.pos, pre: p }];
  });
}

function nextBoard(board: Board): Board {
  return {
    ...board,
    blizzards: board.blizzards.map(b => {
      let { x, y } = b.pos;
      if (b.dir === ">") {
        x++;
        if (x >= board.width) x = 0;
      } else if (b.dir === "<") {
        x--;
        if (x < 0) x = board.width - 1;
      } else if (b.dir === "v") {
        y++;
        if (y >= board.height) y = 0;
      } else if (b.dir === "^") {
        y--;
        if (y < 0) y = board.height - 1;
      }
      return { ...b, pos: new Vector(x, y) };
    }),
  };
}

// 159: Too low
// 205: too low
// 241: too high
// 240: Correct!
