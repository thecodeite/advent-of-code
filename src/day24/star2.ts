import { Vector } from "../Vector";
import { Board, dump, Input } from "./parse";

interface Path {
  pos: Vector;
  pre?: Path;
}

export function findRoute(board: Board, start: Vector, finish: Vector) {
  let moveCount = 0;
  let positions: Path[] = [{ pos: start }];
  let winner = undefined as Path | undefined;

  do {
    // dump(board);
    board = nextBoard(board);
    positions = calcNextPositions(board, positions, moveCount);
    moveCount++;
    winner = positions.find(p => p.pos.eq(finish));

    if (moveCount > 900) {
      // const best = positions.min(p => p.pos.distanceTo(finish));
      // dump({ ...board }, ...replay(best));
      // dump({ ...board }, ...positions.map(p => p.pos));
      if (moveCount > 909) throw "1000";
    }
  } while (!winner);

  return { moveCount, board, winner };
}

export function solve(input: Input) {
  const initialState = { ...input, pos: input.start };

  let board: Board = input;

  // let positions: Path[] = [{ pos: input.start }];
  // let moveCount = 0;
  let moves = 0;
  let [m1, m2, m3] = [0, 0, 0];
  let winner = undefined as Path | undefined;

  ({
    moveCount: m1,
    board,
    winner,
  } = findRoute(board, input.start, input.finish));
  dump({ ...board }, ...replay(winner));
  // moves += m1;

  ({
    moveCount: m2,
    board,
    winner,
  } = findRoute(board, input.finish, input.start));
  dump({ ...board }, ...replay(winner));
  // moves += moveCount;

  ({
    moveCount: m3,
    board,
    winner,
  } = findRoute(board, input.start, input.finish));
  dump({ ...board }, ...replay(winner));

  return [m1, m2, m3, m1 + m2 + m3];
  // moves += moveCount;

  // positions = [{ pos: input.finish }];
  // winner = undefined;

  // do {
  //   // dump(board);
  //   board = nextBoard(board);
  //   positions = calcNextPositions(board, positions);
  //   move++;
  //   winner = positions.find(p => p.pos.eq(input.finish));
  //   if (move > 1000) throw "1000";
  // } while (!winner);

  // console.log("start:", input.start.toI(input.width));
  // console.log("finish:", input.finish.toI(input.width));

  // const validPath = winner && replay(winner);

  // console.log("validPath:", validPath);
  // validPath && dump({ ...board }, ...validPath);
  // console.log("finish:", input.finish);

  return moves;
}

function replay(path: Path): Vector[] {
  if (path.pre) return [path.pos, ...replay(path.pre)];
  else return [path.pos];
}

function calcNextPositions(
  board: Board,
  positions: Path[],
  moveCount?: number,
): Path[] {
  const { width, height, start, finish } = board;
  // const possible: Path[] = [];
  const checked: number[] = [];
  const startI = start.toI(width + 2);
  const finishI = finish.toI(width + 2);
  // console.log("startI, finishI:", startI, finishI);

  return positions.flatMap(p => {
    const candidates: Path[] = [
      { pos: p.pos, pre: p },
      { pos: p.pos.down(), pre: p },
      { pos: p.pos.right(), pre: p },
      { pos: p.pos.left(), pre: p },
      { pos: p.pos.up(), pre: p },
    ];

    const check = (p: Path) => {
      const { pos } = p;
      const i = pos.toI(width + 2);
      if (checked.includes(i)) return "F included";
      checked.push(i);
      if (i === startI) return "T startI";
      if (i === finishI) return "T finishI";
      const { x, y } = pos;
      if (x < 0) return `F x < 0 (${x})`;
      if (y < 0) return `F y < 0 (${y})`;
      if (x >= width) return `F x > width (${[x, width]})`;
      if (y >= height) return `F y >= height (${[y, height]})`;
      if (board.blizzards.some(b => pos.eq(b.pos))) return `F bliz`;
      return "T end";
    };

    if (moveCount && moveCount > 900) {
      console.log("candidates:", candidates, candidates.map(check));
    }

    const possible = candidates.filter(p => {
      // const { pos } = p;
      // const i = pos.toI(width);
      // if (checked.includes(i)) return false;
      // checked.push(i);
      // if (i === startI) return true;
      // if (i === finishI) return true;
      // const { x, y } = pos;
      // if (x < 0) return false;
      // if (y < 0) return false;
      // if (x > width) return false;
      // if (y >= height) return false;
      // if (board.blizzards.some(b => pos.eq(b.pos))) return false;
      // return true;
      const c = check(p);
      return c[0] === "T";
    });

    return possible;
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

// tried: 715: Low
