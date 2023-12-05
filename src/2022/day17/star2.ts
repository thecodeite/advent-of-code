import { repeat } from "../../common/util";
import { Input } from "./parse";

type RockShape = string[];

const rockTypes: RockShape[] = [
  ["1234"], //
  [
    " 1 ", //
    "324", //
    " 5 ", //
  ],
  [
    "  1", //
    "  2", //
    "543", //
  ],
  [
    "1", //
    "2", //
    "3", //
    "4", //
  ],
  [
    "12", //
    "43", //
  ],
];

interface Rock {
  rockShape: string[];
  height: number;
  width: number;
  canSlideRightTo: (x: number, y: number, board: boolean[]) => boolean;
  canSlideLeftTo: (x: number, y: number, board: boolean[]) => boolean;
  canFallTo: (x: number, y: number, board: boolean[]) => boolean;
  rest: (x: number, y: number, board: boolean[]) => void;
  sr?: StringRock;
}

class HBarRock implements Rock {
  rockShape: string[];
  height: number;
  width: number;
  sr: StringRock;

  constructor(rockShape: string[]) {
    this.rockShape = rockShape;
    this.height = 1;
    this.width = 4;
    this.sr = new StringRock(rockShape);
  }

  rest(x: number, y: number, board: boolean[]) {
    const p = x + y * 7;
    board[p] = board[p + 1] = board[p + 2] = board[p + 3] = true;
    // this.sr.rest(x, y, board);
  }

  canFallTo(x: number, y: number, board: boolean[]) {
    if (y < 0) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 1] || board[p + 2] || board[p + 3]);

    // return this.sr.canFallTo(x, y, board);
  }

  canSlideLeftTo(x: number, y: number, board: boolean[]) {
    // if (x < 0) return false;
    const p = x + y * 7;
    return !board[p];
    // return this.sr.canSlideTo(x, y, board);
  }
  canSlideRightTo(x: number, y: number, board: boolean[]) {
    // if (x + this.width > 7) return false;
    const p = x + y * 7;
    return !board[p + 3];
    // return this.sr.canSlideTo(x, y, board);
  }
}

class CrossRock implements Rock {
  rockShape: string[];
  height: number;
  width: number;
  sr: StringRock;

  constructor(rockShape: string[]) {
    this.rockShape = rockShape;
    this.height = 3;
    this.width = 3;
    this.sr = new StringRock(rockShape);
  }

  rest(x: number, y: number, board: boolean[]) {
    // return this.sr.rest(x, y, board);
    const p = x + y * 7;
    board[p + 1] =
      board[p + 7] =
      board[p + 8] =
      board[p + 9] =
      board[p + 15] =
        true;
  }

  canFallTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canFallTo(x, y, board);
    if (y < 0) return false;
    const p = x + y * 7;
    return !(board[p + 1] || board[p + 7] || board[p + 9]);
  }

  canSlideLeftTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canSlideTo(x, y, board);
    // if (x < 0) return false;
    const p = x + y * 7;
    return !(board[p + 1] || board[p + 7] || board[p + 15]);
  }
  canSlideRightTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canSlideTo(x, y, board);
    // if (x > 4) return false;
    // if (x + this.width > 7) return false;
    const p = x + y * 7;
    return !(board[p + 1] || board[p + 9] || board[p + 15]);
  }
}

class VBarRock implements Rock {
  rockShape: string[];
  height: number;
  width: number;
  sr: StringRock;

  constructor(rockShape: string[]) {
    this.rockShape = rockShape;
    this.height = 4;
    this.width = 1;
    this.sr = new StringRock(rockShape);
  }

  rest(x: number, y: number, board: boolean[]) {
    // this.sr.rest(x, y, board);
    const p = x + y * 7;
    board[p] = board[p + 7] = board[p + 14] = board[p + 21] = true;
  }

  canFallTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canFallTo(x, y, board);
    if (y < 0) return false;
    const p = x + y * 7;
    return !board[p];
  }

  canSlideLeftTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canSlideTo(x, y, board);
    // if (x < 0) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 7] || board[p + 14] || board[p + 21]);
  }
  canSlideRightTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canSlideTo(x, y, board);
    // if (x + this.width > 7) return false;
    // if (x > 6) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 7] || board[p + 14] || board[p + 21]);
  }
}

class ReverseLRock implements Rock {
  rockShape: string[];
  height: number;
  width: number;
  sr: StringRock;

  constructor(rockShape: string[]) {
    this.rockShape = rockShape;
    this.height = 3;
    this.width = 3;
    this.sr = new StringRock(rockShape);
  }

  rest(x: number, y: number, board: boolean[]) {
    // return this.sr.rest(x, y, board);
    const p = x + y * 7;
    board[p] =
      board[p + 1] =
      board[p + 2] =
      board[p + 9] =
      board[p + 16] =
        true;
  }

  canFallTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canFallTo(x, y, board);
    if (y < 0) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 1] || board[p + 2]);
  }

  canSlideLeftTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canSlideTo(x, y, board);
    // if (x < 0) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 9] || board[p + 16]);
  }

  canSlideRightTo(x: number, y: number, board: boolean[]) {
    // if (x > 4) return false;
    // if (x + this.width > 7) return false;
    // return this.sr.canSlideTo(x, y, board);
    const p = x + y * 7;
    return !(board[p + 2] || board[p + 9] || board[p + 16]);
  }
}

class SquareRock implements Rock {
  rockShape: string[];
  height: number;
  width: number;
  sr: StringRock;

  constructor(rockShape: string[]) {
    this.rockShape = rockShape;
    this.height = 2;
    this.width = 2;
    this.sr = new StringRock(rockShape);
  }

  rest(x: number, y: number, board: boolean[]) {
    // return this.sr.rest(x, y, board);
    const p = x + y * 7;
    board[p] = board[p + 1] = board[p + 7] = board[p + 8] = true;
  }

  canFallTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canFallTo(x, y, board);
    if (y < 0) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 1]);
  }

  canSlideLeftTo(x: number, y: number, board: boolean[]) {
    // return this.sr.canSlideTo(x, y, board);
    // if (x < 0) return false;
    const p = x + y * 7;
    return !(board[p] || board[p + 7]);
  }
  canSlideRightTo(x: number, y: number, board: boolean[]) {
    // this.sr.canSlideTo(x, y, board);
    // if (x > 5) return false;
    // if (x + this.width > 7) return false;
    const p = x + y * 7;
    return !(board[p + 1] || board[p + 8]);
  }
}

class StringRock implements Rock {
  rockShape: string[];
  height: number;
  width: number;
  constructor(rockShape: string[]) {
    this.rockShape = rockShape;
    this.height = rockShape.length;
    this.width = rockShape[0].length;
  }

  canSlideLeftTo(x: number, y: number, board: boolean[]) {
    return this.canMoveTo(x, y, board);
  }
  canSlideRightTo(x: number, y: number, board: boolean[]): boolean {
    return this.canMoveTo(x, y, board);
  }
  canSlideTo(x: number, y: number, board: boolean[]): boolean {
    return this.canMoveTo(x, y, board);
  }
  canFallTo(x: number, y: number, board: boolean[]): boolean {
    return this.canMoveTo(x, y, board);
  }
  canMoveTo(x: number, y: number, board: boolean[]): boolean {
    for (let col = 0; col < this.rockShape.length; col++) {
      for (let row = 0; row < this.rockShape[col].length; row++) {
        const char = this.rockShape[this.rockShape.length - col - 1]?.[row];
        if (char && char !== " ") {
          const xPos = row + x;
          const yPos = col + y;
          if (xPos < 0 || xPos >= 7) return false;
          if (yPos < 0) return false;

          const p = xPos + yPos * 7;
          if (board[p]) return false;
        }
      }
    }
    return true;
  }

  rest(x: number, y: number, board: boolean[]) {
    for (let col = 0; col < this.rockShape.length; col++) {
      for (let row = 0; row < this.rockShape[col].length; row++) {
        const char = this.rockShape[this.rockShape.length - col - 1]?.[row];
        if (char && char !== " ") {
          const xPos = row + x;
          const yPos = col + y;
          const p = xPos + yPos * 7;
          board[p] = true;
        }
      }
    }
  }
}

// const rocks = [
//   new StringRock(rockTypes[0]),
//   new StringRock(rockTypes[1]),
//   new StringRock(rockTypes[2]),
//   new StringRock(rockTypes[3]),
//   new StringRock(rockTypes[4]),
// ];
const rocks = [
  new HBarRock(rockTypes[0]),
  new CrossRock(rockTypes[1]),
  new ReverseLRock(rockTypes[2]),
  new VBarRock(rockTypes[3]),
  new SquareRock(rockTypes[4]),
];

let height: number = 0;
let virtualHeight = 0;
let moveIndex: number = 0;
let rockShapeIndex: number = 0;
let rock: Rock;
let rockX: number = 0;
let rockY: number = 0;
let rockAge: number = 0;
let board: boolean[] = [];
let skipped = 0;

function addNextRock() {
  rockX = 2;
  rockY = height + 3;
  rockAge = 0;
  rock = rocks[rockShapeIndex];

  rockShapeIndex = (rockShapeIndex + 1) % rocks.length;
}

function rest() {
  rock.rest(rockX, rockY, board);

  const proposedNewHeight = rockY + rock.height;
  const newHeight = Math.max(height, proposedNewHeight);
  const newHeightDelta = newHeight - height;

  height += newHeightDelta;
  virtualHeight += newHeightDelta;
}

function left(rock: Rock, x: number, y: number, board: boolean[]) {
  const custom = rock.canSlideLeftTo(x, y, board);
  const str = rock.sr?.canSlideLeftTo(x, y, board);
  if (custom !== str) {
    render();
    console.log("rock:", rock, custom, str);
    throw "left";
  }
  return str;
}
function right(rock: Rock, x: number, y: number, board: boolean[]) {
  const custom = rock.canSlideRightTo(x, y, board);
  const str = rock.sr?.canSlideRightTo(x, y, board);
  if (custom !== str) {
    render();
    console.log("rock:", rock, custom, str);
    throw "right";
  }
  return str;
}

function jetAndFall(moves: number[]) {
  rockAge++;
  const dir = moves[moveIndex];
  moveIndex = (moveIndex + 1) % moves.length;

  if (dir === -1) {
    if (rockAge <= 2 && rockX > 0) {
      rockX -= 1;
    } else if (rockX - 1 >= 0 && left(rock, rockX + dir, rockY, board)) {
      rockX -= 1;
    }
  }
  if (dir === 1) {
    if (rockAge <= 2 && rockY + rock.width < 7) {
      rockX += 1;
    } else if (
      rockX + 1 + rock.width <= 7 &&
      right(rock, rockX + dir, rockY, board)
    ) {
      rockX += 1;
    }
  }

  if (rockAge <= 2 || rock.canFallTo(rockX, rockY - 1, board)) {
    rockY--;
    return true;
  }
  rest();
  return false;
}

function render() {
  const out: string[] = [];
  out.push("\n");
  out.push("\n");
  const start = height + 3;
  const dh = virtualHeight - height;
  for (let row = start; row >= start - 10; row--) {
    // out.push(`${row} ${row + dh}`);
    out.push("|");
    // console.log("row", row, rock.y, rock.height);

    for (let col = 0; col < 7; col++) {
      let char = ".";
      if (row >= rockY && row < rockY + rock.height) {
        const rockYPos = rock.height - (row - rockY) - 1;

        if (col >= rockX && col < rockX + rock.width) {
          const rockXPos = col - rockX;
          const rockChar = rock.rockShape[rockYPos][rockXPos];
          if (rockChar !== " ") {
            char = rockChar;
          }
        }
      }

      const onBoard = board[col + row * 7];
      if (onBoard) {
        char = "#";
      }

      if (row === rockY && col === rockX) {
        char = "X";
      }

      out.push(char);
    }
    out.push("|");
    out.push("\n");
  }

  // out.push("+", repeat("-", 7), "+");
  // out.push("\n");

  console.log(out.join(""));
}

export function solve(input: Input) {
  const { moves } = input;

  addNextRock();
  const targetCount = 1000000000000;

  const keys: Record<string, [number, number]> = {};
  let foundCycle = false;
  let firstKey = undefined as string | undefined;
  let foundCount = 0;
  for (let blocks = 0; blocks < targetCount; ) {
    // if (blocks > 0 && moveIndex === 0) {
    //   // console.log({ blocks, height, deedCount });
    //   // render();
    //   // deedCount++;
    //   // if (deedCount > 10) break;

    //   let diffHeight = height - prevHeight;
    //   let diffBlocks = blocks - prevBlocks;
    //   console.log({ diffHeight, diffBlocks, deedCount });
    //   render();
    //   deedCount++;
    //   prevBlocks = blocks;
    //   prevHeight = height;

    //   if (deedCount === 3) {
    //     const multi = Math.floor((targetCount - blocks) / diffBlocks);

    //     console.log("multi:", multi);

    //     blocks += multi * diffBlocks;
    //     virtualHeight = height + multi * diffHeight;
    //     // while (blocks + diffBlocks < targetCount) {
    //     //   blocks += diffBlocks;
    //     //   virtualHeight += diffHeight;
    //     // }
    //   }
    // }

    // if (blocks > 122) {
    //   render();
    // }
    // if (blocks > 133) break;

    if (!jetAndFall(moves)) {
      blocks++;
      // console.log("blocks:", blocks);
      if (!foundCycle) {
        const mapOfTop = mapTop(board, height);
        if (mapOfTop) {
          const key = `${moveIndex},${rockShapeIndex},[${mapOfTop}]`;

          if (keys[key]) {
            const diffBlocks = blocks - keys[key][0];
            const diffHeight = height - keys[key][1];
            console.log({ diffBlocks, diffHeight });
            const multi = Math.floor((targetCount - blocks) / diffBlocks);

            blocks += multi * diffBlocks;
            virtualHeight = height + multi * diffHeight;
            foundCycle = true;
          }
          keys[key] = [blocks, height];
        }
      }

      addNextRock();
    }
  }

  return virtualHeight;
}

function mapTop(board: boolean[], height: number) {
  const tops: number[] = Array.from({ length: 6 });
  let p = height * 7 + 6;

  let h = 1;
  while (h < 200) {
    for (let col = 6; col >= 0; col--) {
      if (!tops[col] && board[p]) {
        tops[col] = h;
      }
      p--;
    }
    h++;
  }
  return tops;
}

/*
 sample: 1514285714288
  guess: 1569767441816 is too low
  guess: 1569767441817 is too low

  guess: 1566666666681 is too low

  guess: 1606369426764 Wrong
  guess: 1550432276649 Wrong
  guess: 1597714285698 Correct!
*/
