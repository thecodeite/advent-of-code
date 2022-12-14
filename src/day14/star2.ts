import { Vector } from "../Vector";
import { Input } from "./parse";
import * as fs from "node:fs/promises";

type Map = boolean | undefined;

export async function solve(input: Input) {
  const allX = input.chains.flatMap(c => c.nodes.flatMap(r => r.x));
  const allY = input.chains.flatMap(c => c.nodes.flatMap(r => r.y));

  const minX = allX.min();
  const minY = 0;
  const maxX = allX.max();
  const maxY = allY.max();

  const width = 1000;
  const height = maxY + 1;
  const area = width * height;
  const map: Map[] = Array.from({ length: area }, () => undefined);

  // console.log({ minX, minY });
  // console.log({ maxX, maxY });
  // console.log("{width, height}:", { width, height });

  // const normalised = [
  //   ...input.chains.map(c => {
  //     return { nodes: c.nodes.map(r => ({ x: r.x, y: r.y })) };
  //   }),
  // ];
  const entry = 500;

  const rasterizedRocks = input.chains.flatMap(chain => {
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
  });

  rasterizedRocks.forEach(rock => {
    const p = rock.x + rock.y * width;
    map[p] = true;
  });

  // let rasterizedSnow: string[] = [];
  let snowFlake: Vector = new Vector(entry, 0);
  // dump(width, height, rasterizedRocks, rasterizedSnow, snowFlake, entry);
  // return;

  let flake = 0;
  let yRenderStart = 0;

  for (let t = 0; t < 10000000; t++) {
    // if (flake % 100 === 0 && snowFlake.y === 0) {
    //   console.log(flake);
    // }
    // if (snowFlake.y > 180) {
    //   dump(false, width, height, map, snowFlake, entry, flake);
    //   await new Promise(r => setTimeout(r, 500));
    // }

    const newSnowFlake = move(snowFlake, map, height, width);

    if (newSnowFlake !== snowFlake) {
      snowFlake = newSnowFlake;
    } else {
      if (newSnowFlake.x === entry && newSnowFlake.y === 0) {
        // await dump(true, width, height, map, snowFlake, entry, flake);
        return map.filter(x => x === false).length + 1;
      }
      const p = toP(newSnowFlake, width);
      map[p] = false;
      snowFlake = new Vector(entry, 0);
      yRenderStart = newSnowFlake.y - 10;
      flake++;
    }
  }

  return 0;
}

function move(
  snowFlake: Vector,
  map: Map[],
  bottom: number,
  width: number,
): Vector {
  if (snowFlake.y >= bottom) {
    return snowFlake;
  }

  const down = snowFlake.down();
  const downP = toP(down, width);
  if (map[downP] === undefined) {
    return down;
  }

  const left = down.left();
  const leftP = toP(left, width);

  if (map[leftP] === undefined) {
    return left;
  }

  const right = down.right();
  const rightP = toP(right, width);

  if (map[rightP] === undefined) {
    return right;
  }

  return snowFlake;
}

async function dump(
  all: boolean,
  width: number,
  height: number,
  map: Map[],
  snowFlake: Vector,
  entry: number,
  flakes: number,
) {
  // console.clear();
  // process.stdout.write("\x1B[2J");
  const snowFlakeRaster = snowFlake.toString();
  const out: string[] = [];

  let startY = all ? 0 : snowFlake.y - 8;
  let endY = all ? height + 3 : snowFlake.y + 8;

  if (startY < 0) {
    endY += 0 - startY;
    startY += 0 - startY;
  }
  let startX = all ? 0 : snowFlake.x - 40;
  let endX = all ? 1000 : snowFlake.x + 40;

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
    out.push(...`${y}`.padStart(3, " "));
    for (let x = startX; x <= endX; x++) {
      const p = x + y * width;
      const at = map[p];
      if (y === height + 2) {
        out.push("█");
      } else if (at === false) {
        out.push("o");
      } else if (at === true) {
        out.push("█");
      } else if (p === toP(snowFlake, width)) {
        out.push("*");
      } else {
        out.push(" ");
      }
    }

    out.push(..."\n");
  }
  const calDate = process.env.CAL_DATE;
  await fs.writeFile(`./src/day${calDate}/result.txt`, out.join(""));
  console.log(out.join(""));
  console.log("flakes:", flakes);
}

function toP(v: { x: number; y: number }, width: number) {
  return v.x + v.y * width;
}
