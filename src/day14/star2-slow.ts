import { Vector } from "../Vector";
import { Input } from "./parse";

export async function solve(input: Input) {
  const allX = input.chains.flatMap(c => c.nodes.flatMap(r => r.x));
  const allY = input.chains.flatMap(c => c.nodes.flatMap(r => r.y));

  const minX = allX.min();
  const minY = 0;
  const maxX = allX.max();
  const maxY = allY.max();

  const width = maxX - minX;
  const height = maxY - minY;

  console.log({ minX, minY });
  console.log({ maxX, maxY });
  console.log("{width, height}:", { width, height });

  const normalised = [
    ...input.chains.map(c => {
      return { nodes: c.nodes.map(r => ({ x: r.x, y: r.y })) };
    }),
  ];
  const entry = 500;

  const rasterizedRocks = normalised
    .flatMap(chain => {
      let [prevNode, ...nodes] = chain.nodes;
      const rocks = nodes.flatMap(node => {
        const start = prevNode;
        prevNode = node;
        if (node.x === start.x) {
          return Array.from({ length: Math.abs(node.y - start.y) }, (_, i) => ({
            x: node.x,
            y: start.y + i * Math.sign(node.y - start.y),
          }));
        } else {
          return Array.from({ length: Math.abs(node.x - start.x) }, (_, i) => ({
            x: start.x + i * Math.sign(node.x - start.x),
            y: node.y,
          }));
        }
      });
      return [...rocks, prevNode];
    })
    .map(r => `${r.x},${r.y}`);

  let rasterizedSnow: string[] = [];
  let snowFlake: Vector = new Vector(entry, 0);
  // dump(width, height, rasterizedRocks, rasterizedSnow, snowFlake, entry);
  // return;

  let flake = 0;
  let yRenderStart = 0;

  for (let t = 0; t < 10000000; t++) {
    if (flake % 100 === 0 && snowFlake.y === 0) {
      console.log(flake);
    }
    if (flake % 10000 === 0) {
      dump(width, height, rasterizedRocks, rasterizedSnow, snowFlake, entry);
      await new Promise(r => setTimeout(r, 100));
    }

    const newSnowFlake = move(
      snowFlake,
      rasterizedRocks,
      rasterizedSnow,
      height + 1,
    );

    if (newSnowFlake !== snowFlake) {
      snowFlake = newSnowFlake;
    } else {
      if (newSnowFlake.x === entry && newSnowFlake.y === 0) {
        dump(width, height, rasterizedRocks, rasterizedSnow, snowFlake, entry);
        return rasterizedSnow.length;
      }

      rasterizedSnow.push(newSnowFlake.toString());
      snowFlake = new Vector(entry, 0);
      yRenderStart = newSnowFlake.y - 10;
      flake++;
    }
  }

  return 0;
}

function move(
  snowFlake: Vector,
  rasterizedBlocks: string[],
  rasterizedSnow: string[],
  bottom: number,
): Vector {
  if (snowFlake.y >= bottom) {
    return snowFlake;
  }

  const down = snowFlake.down();
  const downStr = down.toString();

  if (
    !rasterizedBlocks.includes(downStr) &&
    !rasterizedSnow.includes(downStr)
  ) {
    return down;
  }

  const left = down.left();
  const leftStr = left.toString();

  if (
    !rasterizedBlocks.includes(leftStr) &&
    !rasterizedSnow.includes(leftStr)
  ) {
    return left;
  }

  const right = down.right();
  const rightStr = right.toString();

  if (
    !rasterizedBlocks.includes(rightStr) &&
    !rasterizedSnow.includes(rightStr)
  ) {
    return right;
  }

  return snowFlake;
}

function dump(
  width: number,
  height: number,
  rasterizedRocks: string[],
  rasterizedSnow: string[],
  snowFlake: Vector,
  entry: number,
) {
  // console.clear();
  process.stdout.write("\x1B[2J");
  const snowFlakeRaster = snowFlake.toString();
  const out: string[] = [];

  let startY = snowFlake.y - 8;
  let endY = snowFlake.y + 8;

  if (startY < 0) {
    endY += 0 - startY;
    startY += 0 - startY;
  }
  let startX = snowFlake.x - 40;
  let endX = snowFlake.x + 40;

  if (startX < 0) {
    endX += 0 - startX;
    startX += 0 - startX;
  }

  for (let radix = 100; radix >= 1; radix /= 10) {
    // process.stdout.write("  ");
    out.push(..."   ");
    for (let x = startX; x <= endX; x++) {
      if (x % 2 === 9) {
        // process.stdout.write(" ");
        out.push(..." ");
      } else {
        const digit = Math.floor((x % (radix * 10)) / radix);
        // if (x < radix) process.stdout.write(" ");
        // else process.stdout.write(digit + "");
        if (x < radix) out.push(..." ");
        else out.push(digit.toString());
      }
    }
    // console.log();
    out.push(..."\n");
  }

  // process.stdout.write("  ");
  out.push(..."   ");
  for (let x = startX; x <= endX; x++) {
    if (x === entry) out.push("v");
    else out.push(" ");
    // if (x === entry) process.stdout.write("v");
    // else process.stdout.write(" ");
  }
  // console.log();
  out.push(..."\n");

  for (let y = startY; y <= endY; y++) {
    // process.stdout.write(`${y}`.padStart(2, " "));
    out.push(...`${y}`.padStart(3, " "));
    for (let x = startX; x <= endX; x++) {
      const loc = `${x},${y}`;
      if (rasterizedSnow.includes(loc)) {
        // process.stdout.write("%");
        out.push("o");
      } else if (snowFlakeRaster === loc) {
        // process.stdout.write("*");
        out.push("*");
      } else if (y === height + 2) {
        out.push("█");
      } else if (rasterizedRocks.includes(loc)) {
        // process.stdout.write("█");
        out.push("█");
      } else {
        // process.stdout.write(" ");
        out.push(" ");
      }
    }
    // console.log();
    out.push(..."\n");
  }
  console.log(out.join(""));
  console.log(rasterizedSnow.length);
}
