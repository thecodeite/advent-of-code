import { Vector } from "../../common/Vector";
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

  const normalised = input.chains.map(c => {
    return { nodes: c.nodes.map(r => ({ x: r.x - minX, y: r.y - minY })) };
  });
  const entry = 500 - minX;

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

  for (let t = 0; t < 1000000; t++) {
    // dump(width, height, rasterizedRocks, rasterizedSnow, snowFlake, entry);
    // await new Promise(r => setTimeout(r, 100));

    const newSnowFlake = move(snowFlake, [
      ...rasterizedRocks,
      ...rasterizedSnow,
      snowFlake.toString(),
    ]);

    if (newSnowFlake !== snowFlake) {
      if (snowFlake.y > height) {
        return rasterizedSnow.length;
      }
      snowFlake = newSnowFlake;
    } else {
      rasterizedSnow.push(newSnowFlake.toString());
      snowFlake = new Vector(entry, 0);
    }
  }

  return 0;
}

function move(snowFlake: Vector, rasterized: string[]): Vector {
  if (!rasterized.includes(snowFlake.down().toString())) {
    return snowFlake.down();
  } else if (!rasterized.includes(snowFlake.down().left().toString())) {
    return snowFlake.down().left();
  } else if (!rasterized.includes(snowFlake.down().right().toString())) {
    return snowFlake.down().right();
  } else {
    return snowFlake;
  }
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

  let startY = snowFlake.y - 11;
  let endY = snowFlake.y + 11;

  if (startY < 0) {
    endY += 0 - startY;
    startY += 0 - startY;
  }
  const renderHeight = endY - startY;

  for (let radix = 100; radix >= 1; radix /= 10) {
    // process.stdout.write("  ");
    out.push(..."  ");
    for (let x = 0; x <= width; x++) {
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
  out.push(..."  ");
  for (let x = 0; x <= width; x++) {
    if (x === entry) out.push("v");
    else out.push(" ");
    // if (x === entry) process.stdout.write("v");
    // else process.stdout.write(" ");
  }
  // console.log();
  out.push(..."\n");

  for (let y = startY; y <= endY; y++) {
    // process.stdout.write(`${y}`.padStart(2, " "));
    out.push(...`${y}`.padStart(2, " "));
    for (let x = 0; x <= width; x++) {
      const loc = `${x},${y}`;
      if (rasterizedRocks.includes(loc)) {
        // process.stdout.write("█");
        out.push("█");
      } else if (rasterizedSnow.includes(loc)) {
        // process.stdout.write("%");
        out.push("%");
      } else if (snowFlakeRaster === loc) {
        // process.stdout.write("*");
        out.push("*");
      } else {
        // process.stdout.write(" ");
        out.push(" ");
      }
    }
    // console.log();
    out.push(..."\n");
  }
  console.log(out.join(""));
}
