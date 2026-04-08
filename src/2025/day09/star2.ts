import { mkdirSync } from "fs";
import {
  PaletteEntry,
  PNGDataPreFiltered,
  writePng,
} from "../../common/utils/simple-png";
import { Input } from "./parse";
const imagePath = `images/2025/day09`;
mkdirSync(imagePath, { recursive: true });

type Point = Input["lines"][number] & { i: number };

const scale = 150;

function writePixel(scanLine: Uint8Array, x: number, set: boolean) {
  const byteIndex = Math.floor(x / 8) + 1;
  const bitIndex = x % 8;
  if (set) {
    scanLine[byteIndex] |= 1 << (7 - bitIndex);
  } else {
    scanLine[byteIndex] &= ~(1 << (7 - bitIndex));
  }
}

function getPixel(scanLine: Uint8Array, x: number) {
  const byteIndex = Math.floor(x / 8);
  const bitIndex = x % 8;

  const mask = 1 << (7 - bitIndex);
  const byte = scanLine[byteIndex + 1];
  const bit = (byte & mask) > 0;
  // console.log(x, byte, mask, bit);
  return bit;
}

function floodFill(start: { x: number; y: number }, scanLines: Uint8Array[]) {
  const { x, y } = start;
  writePixel(scanLines[y], x, true);
  const potentialNeighbors: { x: number; y: number }[] = [{ x, y }];

  while (potentialNeighbors.length > 0) {
    const current = potentialNeighbors.pop()!;
    const { x, y } = current;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 0 &&
          newX < scanLines[0].length * 8 &&
          newY >= 0 &&
          newY < scanLines.length &&
          !getPixel(scanLines[newY], newX)
        ) {
          writePixel(scanLines[newY], newX, true);
          potentialNeighbors.push({ x: newX, y: newY });
          // if (!getPixel(scanLines[newY], newX)) {
          //   floodFill({ x: newX, y: newY }, scanLines);
          // }
        }
      }
    }
  }
}

function fillRect(
  scanLines: Uint8Array[],
  rect: { x1: number; y1: number; x2: number; y2: number },
  set: boolean,
) {
  const xDir = rect.x1 < rect.x2 ? 1 : -1;
  const yDir = rect.y1 < rect.y2 ? 1 : -1;

  for (let y = rect.y1; y !== rect.y2 + yDir; y += yDir) {
    for (let x = rect.x1; x !== rect.x2 + xDir; x += xDir) {
      writePixel(scanLines[y], x, set);
    }
  }
}

export function solveV(input: Input) {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (const line of input.lines) {
    line.x = Math.round(line.x / scale);
    line.y = Math.round(line.y / scale);
  }

  input.lines.forEach(line => {
    if (line.x < minX) {
      minX = line.x;
    }
    if (line.x > maxX) {
      maxX = line.x;
    }
    if (line.y < minY) {
      minY = line.y;
    }
    if (line.y > maxY) {
      maxY = line.y;
    }
  });
  console.log("minX:", minX, "maxX:", maxX, "minY:", minY, "maxY:", maxY);

  const transposed = input.lines.map(line => {
    return {
      text: line.text,
      x: line.x - minX,
      y: line.y - minY,
    };
  });

  minX = 0;
  minY = 0;
  maxX = maxX - minX;
  maxY = maxY - minY;

  // const grid = new Uint8Array((maxX + 1) * (maxY + 1));
  const scanLines: Uint8Array[] = [];
  for (let y = 0; y <= maxY; y++) {
    const scanLineSize = Math.ceil((maxX + 1) / 8) + 1;
    const scanLine = new Uint8Array(scanLineSize);
    scanLine[0] = 0; // Filter type byte
    scanLines.push(scanLine);
  }

  for (let index = 0; index < transposed.length; index++) {
    const next = (index + 1) % transposed.length;
    const p1 = transposed[index];
    const p2 = transposed[next];

    const xDiff = p2.x - p1.x;
    const yDiff = p2.y - p1.y;

    // console.log("xDiff, yDiff:", xDiff, yDiff, "       ", p1.x, p1.y);

    if (xDiff === 0) {
      // vertical line
      const x = p1.x;
      const yStart = Math.min(p1.y, p2.y);
      const yEnd = Math.max(p1.y, p2.y);
      for (let y = yStart; y <= yEnd; y++) {
        // grid[y * (maxX + 1) + x] = 1;
        writePixel(scanLines[y + 1], x, true);
        //   scanLines[y * 2 + 1][x] = 1;
      }
    } else if (yDiff === 0) {
      // horizontal line
      const y = p1.y;
      const xStart = Math.min(p1.x, p2.x);
      const xEnd = Math.max(p1.x, p2.x);
      for (let x = xStart; x <= xEnd; x++) {
        // grid[y * (maxX + 1) + x] = 1;
        // scanLines[y * 2 + 1][x] = 1;
        writePixel(scanLines[y + 1], x, true);
      }
    } else {
      throw new Error(
        `Unexpected line from (${p1.x}, ${p1.y}) to (${p2.x}, ${p2.y})`,
      );
    }
  }

  const ffStartX = Math.round(20000 / scale);
  const ffStartY = Math.round(40000 / scale);
  floodFill({ x: ffStartX, y: ffStartY }, scanLines); //10,20

  // for (let tx = 0; tx <= ffStartX; tx++) {
  //   console.log(
  //     "testPixelAt:",
  //     tx,
  //     ffStartY,
  //     getPixel(scanLines[ffStartY], tx),
  //   );
  // }

  const palette: PaletteEntry[] = [
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 0, b: 0 },
  ];

  const max = {
    first: -1,
    second: -1,
    area: -1,
  };
  const rects: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    area: number;
    top: number;
    bottom: number;
  }[] = [];

  const bigLeftLine = { size: Number.NEGATIVE_INFINITY, y: -1, x: -1, i: -1 };
  const bigRightLine = { size: Number.POSITIVE_INFINITY, y: -1, x: -1, i: -1 };

  for (let first = 0; first < transposed.length; first++) {
    const line1 = transposed[first];
    for (let second = first + 1; second < transposed.length; second++) {
      const line2 = transposed[second];
      if (line1.x === line2.x || line1.y === line2.y) {
        continue;
      }
      const dx = line1.x - line2.x;

      const xDiff = Math.abs(dx) + 1;
      const yDiff = Math.abs(line1.y - line2.y) + 1;

      const area = xDiff * yDiff;
      rects.push({
        x1: line1.x,
        y1: line1.y,
        x2: line2.x,
        y2: line2.y,
        area,
        top: Math.min(line1.y, line2.y),
        bottom: Math.max(line1.y, line2.y),
      });

      if (dx > bigLeftLine.size) {
        bigLeftLine.size = dx;
        bigLeftLine.y = line1.y;
        bigLeftLine.x = line1.x;
        bigLeftLine.i = second;
      }
      if (dx < bigRightLine.size) {
        bigRightLine.size = dx;
        bigRightLine.y = line1.y;
        bigRightLine.x = line1.x;
        bigRightLine.i = first;
      }
      // console.log(
      //   `Area of (${transposed[first].x}, ${transposed[first].y}) and (${transposed[second].x}, ${transposed[second].y}) is ${area}`,
      // );

      // if (area > max.area) {
      //   max.first = first;
      //   max.second = second;
      //   max.area = area;
      // }
    }
  }
  console.log("rects.length:", rects.length);
  console.log("bigLeftLine:", bigLeftLine);
  console.log("bigRightLine:", bigRightLine);

  const sorted = rects
    .sortBy(rect => -rect.area)
    .filter(rect => {
      if (rect.top <= bigLeftLine.y && rect.bottom >= bigLeftLine.y) {
        return false;
      }

      if (rect.top <= bigRightLine.y && rect.bottom >= bigRightLine.y) {
        return false;
      }

      // const topLeft = getPixel(scanLines[rect.top + 1], rect.x1);
      // const topRight = getPixel(scanLines[rect.top + 1], rect.x2);
      // const bottomLeft = getPixel(scanLines[rect.bottom + 1], rect.x1);
      // const bottomRight = getPixel(scanLines[rect.bottom + 1], rect.x2);

      // if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
      //   return false;
      // }
      return true;
    });
  console.log("sorted[0]:", sorted[0]);
  // 17652 × 89209 = 1,574,717,268
  /*
  '218 5399,67727: 1696309135',
  '217 5711,67727: 1690376455',
  '220 4694,66691: 1616563806',
  '219 5399,66691: 1603888611',
  '221 4694,65298: 1491313604',
  '222 4992,65298: 1486370976',
  */
  const testAnswer = {
    x1: transposed[218].x,
    y1: transposed[218].y,
    x2: transposed[248].x,
    y2: transposed[248].y,
  };
  fillRect(scanLines, testAnswer, false);

  console.log(`Writing PNG`);
  const pngData: PNGDataPreFiltered = {
    type: "pre-filtered",
    scanLines,
    width: maxX + 1,
    height: maxY + 1,
    palette,
    bitsPerPixel: 1,
  };
  writePng(`${imagePath}/day09-000.png`, pngData);

  return sorted[0].area;
}

export function solve(input: Input) {
  const points = input.lines.map((x, i) => ({ ...x, i }));

  const keyTop = {
    ln: -1,
    dx: Number.NEGATIVE_INFINITY,
    point: points[0],
  };
  const keyBottom = {
    ln: -1,
    dx: Number.POSITIVE_INFINITY,
    point: points[0],
  };

  for (let first = 0; first < points.length; first++) {
    const point1 = points[first];
    const second = (first + 1) % points.length;
    const point2 = points[second];
    const dx = point1.x - point2.x;

    if (dx > keyTop.dx) {
      keyTop.dx = dx;
      keyTop.ln = point1.i + 1;
      keyTop.point = point1;
    }
    if (dx < keyBottom.dx) {
      keyBottom.dx = dx;
      keyBottom.ln = point2.i + 1;
      keyBottom.point = point2;
    }
  }

  // console.log("keyTop:", keyTop);
  // console.log("keyBottom:", keyBottom);

  // bottom candidates are those that have y greater than
  // keyBottom.point.y and x greater than keyBottom.point.x
  const bottomCandidates = points.filter(({ x, y }) => {
    return x > keyBottom.point.x && y > keyBottom.point.y;
  });
  // console.log("bottomCandidates:", bottomCandidates);
  const bestBottom = bottomCandidates.sortBy(line => -line.y)[0];
  const bottomYLimit = bestBottom.y;
  // console.log("bottomYLimit:", bottomYLimit); // 67730

  const areasBottom = points
    .map(point => {
      if (point.i === keyBottom.point.i) {
        return null;
      }
      if (point.y >= bottomYLimit) {
        return null;
      }
      if (point.y <= keyTop.point.y) {
        return null;
      }
      const diffX = Math.abs(point.x - keyBottom.point.x) + 1;
      const diffY = Math.abs(point.y - keyBottom.point.y) + 1;
      const area = diffX * diffY;
      return { point, area };
    })
    .filter(notNull)
    .sortBy(x => -x.area);

  // console.log("areasBottom:", areasBottom[0]);
  // return -1;

  // Look for points above and to the right of the keyTop
  const topCandidates = points.filter(({ x, y }) => {
    return x > keyTop.point.x && y < keyTop.point.y;
  });
  // console.log("topCandidates:", topCandidates);
  const bestTop = topCandidates.sortBy(line => line.y)[0];
  // console.log("bestTop:", bestTop);
  const topYLimit = bestTop.y;
  // console.log("topYLimit:", topYLimit);
  // console.log("keyTop.point.y:", keyTop.point.y);

  const areasTop = points
    .map(point => {
      if (point.i === keyTop.point.i) {
        return null;
      }
      if (point.y <= topYLimit) {
        return null;
      }
      if (point.y >= keyTop.point.y) {
        return null;
      }
      const diffX = Math.abs(point.x - keyTop.point.x) + 1;
      const diffY = Math.abs(point.y - keyTop.point.y) + 1;
      const area = diffX * diffY;
      return { point, area };
    })
    .filter(notNull)
    .sortBy(x => -x.area);

  // console.log(
  //   "areasBottom:",
  //   areasBottom.map(x => `${x.point.i} ${x.point.text}: ${x.area}`),
  // );
  // console.log(
  //   "areasTop:",
  //   areasTop.map(x => `${x.point.i} ${x.point.text}: ${x.area}`),
  // );

  const bestBottomArea = areasBottom[0];
  // console.log("bestBottomArea:", bestBottomArea);

  const bestTopArea = areasTop[0];
  // console.log("bestTopArea:", bestTopArea);

  // Correct answer is 1574717268 (index 218 & 248)

  return Math.max(bestBottomArea.area, bestTopArea.area);
}

export function solveCheat(input: Input) {
  for (let first = 0; first < input.lines.length; first++) {
    const line1 = input.lines[first];
    for (let second = first + 1; second < input.lines.length; second++) {
      const line2 = input.lines[second];
      const diffY = Math.abs(line1.y - line2.y);
      const diffX = Math.abs(line1.x - line2.x);
      const area = (diffX + 1) * (diffY + 1);
      if (area === 1574717268) {
        console.log(
          `Found it! Area of (${input.lines[first].x}, ${input.lines[first].y}) and (${input.lines[second].x}, ${input.lines[second].y}) is ${area}`,
        );
        console.log("first, second:", first, second);
        return area;
      }
    }
  }
  return -1;
}

function notNull<T>(value: T | null): value is T {
  return value !== null;
}
