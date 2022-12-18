import { repeat } from "../util";
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

class Board {
  moves: number[];
  height: number = 0;
  moveIndex: number = 0;
  rockShapeIndex: number = 0;
  rockShape: RockShape = [];
  board: string[];
  rockX = 0;
  rockY = 0;

  constructor(moves: number[]) {
    this.moves = moves;
    this.board = [];
  }

  addNextRock() {
    const rock = rockTypes[this.rockShapeIndex];

    this.rockShape = rock;
    this.rockShapeIndex = (this.rockShapeIndex + 1) % rockTypes.length;

    this.rockY = this.height + 3;
    this.rockX = 2;
  }

  rockCanBeAt(x: number, y: number) {
    for (let col = 0; col < this.rockShape.length; col++) {
      for (let row = 0; row < this.rockShape[col].length; row++) {
        const char = this.rockShape[this.rockShape.length - col - 1]?.[row];
        if (char && char !== " ") {
          const xPos = row + x;
          const yPos = col + y;
          if (xPos < 0 || xPos >= 7) return false;
          if (yPos < 0) return false;

          const p = xPos + yPos * 7;
          if (this.board[p]) return false;
        }
      }
    }
    return true;
  }

  jet() {
    const dir = this.moves[this.moveIndex];
    this.moveIndex = (this.moveIndex + 1) % this.moves.length;

    if (this.rockCanBeAt(this.rockX + dir, this.rockY)) {
      this.rockX += dir;
    }
  }

  rest() {
    for (let col = 0; col < this.rockShape.length; col++) {
      for (let row = 0; row < this.rockShape[col].length; row++) {
        const char = this.rockShape[this.rockShape.length - col - 1]?.[row];
        if (char && char !== " ") {
          const xPos = row + this.rockX;
          const yPos = col + this.rockY;
          const p = xPos + yPos * 7;
          this.board[p] = "#";
        }
      }
    }
    const newHeight = this.rockY + this.rockShape.length;
    this.height = Math.max(this.height, newHeight);
  }

  fall() {
    if (this.rockCanBeAt(this.rockX, this.rockY - 1)) {
      this.rockY--;
      return true;
    }
    this.rest();
    return false;
  }

  render(str?: string) {
    return;
    const out: string[] = [];
    out.push(str ?? "");
    out.push("\n");

    for (let row = this.rockY + this.rockShape.length - 1; row >= 0; row--) {
      out.push("|");
      // console.log("row", row, this.rockY, this.rockShape.length);

      for (let col = 0; col < 7; col++) {
        let char = ".";
        if (row >= this.rockY && row < this.rockY + this.rockShape.length) {
          const rockYPos = this.rockShape.length - (row - this.rockY) - 1;

          if (
            col >= this.rockX &&
            col < this.rockX + this.rockShape[rockYPos].length
          ) {
            const rockXPos = col - this.rockX;
            const rockChar = this.rockShape[rockYPos][rockXPos];
            if (rockChar !== " ") {
              char = rockChar;
            }
          }
        }

        const onBoard = this.board[col + row * 7];
        if (onBoard) {
          char = onBoard;
        }

        if (row === this.rockY && col === this.rockX) {
          char = "X";
        }

        out.push(char);
      }
      out.push("|");
      out.push("\n");
    }

    out.push("+", repeat("-", 7), "+");
    out.push("\n");

    console.log(out.join(""));
  }
}

export function solve(input: Input) {
  const board = new Board(input.moves);

  board.addNextRock();
  // board.render("The first rock begins falling:");
  let max = 10000000;
  for (let tick = 0; tick < 2022; ) {
    if (max-- <= 0) throw "err max";
    board.jet();

    const didFall = board.fall();

    if (!didFall) {
      board.addNextRock();
      // board.render("A new rock begins falling:");
      tick++;
    }
  }

  return board.height;
}
