import {
  PaletteEntry,
  PNGDataRaw,
  writePng,
} from "../../common/utils/simple-png";
import { Point } from "../../common/Vector";
import { Input } from "./parse";
import * as fs from "node:fs";

const eightNeighbours: Point[] = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
];

const red: PaletteEntry = { r: 255, g: 0, b: 0 };
const green: PaletteEntry = { r: 0, g: 255, b: 0 };
const blue: PaletteEntry = { r: 0, g: 0, b: 255 };

const palette: PaletteEntry[] = [
  { r: 255, g: 255, b: 255 }, // White
  { r: 0, g: 0, b: 0 }, // Black
  red, // Red
  green, // Green
  blue, // Blue
];

const imagePath = `images/2025/day04`;
fs.mkdirSync(imagePath, { recursive: true });

const colours = [red, green, blue];

export function solve(input: Input) {
  let iteration = 0;
  const { width, height } = input;
  console.log({ width, height });
  const board: Uint8Array = new Uint8Array(width * height);
  // console.log("initialBoard:", initialBoard);
  writeDataToBoard(input, board);
  const pngData: PNGDataRaw = {
    type: "raw",
    pixels: board,
    width,
    height,
  };
  writePng(`${imagePath}/day04-000.png`, pngData);

  const toRemove = "#";
  let colour: PaletteEntry;
  let accessibleRoles = 0;
  let removedThisIteration = Number.POSITIVE_INFINITY;

  for (iteration = 0; removedThisIteration > 0; iteration++) {
    removedThisIteration = 0;
    colour = colours[iteration % colours.length];

    for (const key in input.data) {
      const location = input.data[key];
      const neighbours = eightNeighbours.map(neighbour => {
        const p = addPoints(location.p, neighbour);
        const key = `${p.x},${p.y}`;
        const d = input.data[key];
        return d ? d.char : ".";
      });
      // console.log("location:", location, neighbours);
      if (location.char === "@") {
        let neighboursWithRolls = 0;
        for (const neighbour of eightNeighbours) {
          const neighbourPoint = addPoints(location.p, neighbour);
          const neighbourKey = `${neighbourPoint.x},${neighbourPoint.y}`;
          const neighbourLocation = input.data[neighbourKey];
          if (neighbourLocation && neighbourLocation.char !== ".") {
            neighboursWithRolls++;
          }
        }
        if (neighboursWithRolls < 4) {
          removedThisIteration++;
          input.data[key].char = toRemove;
          accessibleRoles++;
        }
      }
    }

    writeDataToBoard(input, board);
    writePng(`${imagePath}/day04-${iterationToName(iteration)}.png`, pngData);

    for (const key in input.data) {
      const location = input.data[key];
      if (location.char === toRemove) {
        location.char = ".";
      }
    }
  }

  return accessibleRoles;
}

function iterationToName(iteration: number): string {
  return String(iteration).padStart(3, "0");
}

function addPoints(p1: Point, p2: Point): Point {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function writeDataToBoard(input: Input, board: Uint8Array) {
  const view = new DataView(board.buffer);
  const { width, height } = input;

  // for (const key in input.data) {
  //   const location = input.data[key];
  //   const index = location.p.y * width + location.p.x;
  //   // board[index] = location.char === "@" ? 255 : 0;
  //   //board[index] = Math.floor(Math.random() * 255);
  //   console.log("index:", index);
  //   view.setUint8(index, location.char === "@" ? 255 : 0);
  // }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      const location = input.data[key];
      const index = y * width + x;
      let pixelValue = 0;
      if (location) {
        if (location.char === "@") {
          pixelValue = 1;
        }
        if (location.char === "#") {
          pixelValue = 2;
        }
      }

      // console.log(`set ${index} to ${pixelValue}`);
      view.setUint8(index, pixelValue);
    }
  }
}
