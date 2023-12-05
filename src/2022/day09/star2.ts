import { Input, Move } from "./parse";

const heads = new Set<String>();

function drawGrid([[hx, hy], ...tails]: [number, number][], size: number) {
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      if (hx === x && hy === y) {
        process.stdout.write("H");
      } else if (tails.some(([tx, ty]) => tx === x && ty === y)) {
        const index = tails.findIndex(([tx, ty]) => tx === x && ty === y);
        process.stdout.write(`${index + 1}`);
      } else {
        process.stdout.write(".");
      }
    }
    console.log();
  }
  console.log();
}

function doUnitMove([x, y]: [number, number], d: Move["d"]): [number, number] {
  switch (d) {
    case "U":
      return [x, y + 1];
    case "D":
      return [x, y - 1];
    case "R":
      return [x + 1, y];
    case "L":
      return [x - 1, y];
  }
}

function catchHead([[hx, hy], [tx, ty]]: [number, number][]): [number, number] {
  const dx = hx - tx;
  const dy = hy - ty;

  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    return [tx, ty];
  } else if (Math.abs(dx) > 1 && dy === 0) {
    return [tx + Math.sign(dx), ty];
  } else if (dx === 0 && Math.abs(dy) > 1) {
    return [tx, ty + +Math.sign(dy)];
  } else {
    return [tx + Math.sign(dx), ty + Math.sign(dy)];
  }
  //  else {
  //   throw `${[hx, hy]} ${[tx, ty]} ${[dx, dy]}`;
  // }
}

function doMove(
  [pHead, ...pTails]: [number, number][],
  move: Move,
): [number, number][] {
  let pNewHead: [number, number] = pHead;
  let pNewTails: [number, number][] = [...pTails];
  // console.log("move.s:", move.s);
  for (let s = 0; s < move.s; s++) {
    pNewHead = doUnitMove(pNewHead, move.d);
    pNewTails[0] = catchHead([pNewHead, pNewTails[0]]);
    for (let t = 1; t < 9; t++) {
      pNewTails[t] = catchHead([pNewTails[t - 1], pNewTails[t]]);
    }
    // drawGrid([pNewHead, ...pNewTails], 21);
    heads.add(`${pNewTails[8]},${pNewTails[8]}`);
  }

  return [pNewHead, ...pNewTails];
}

export function solve(input: Input) {
  let pHead: [number, number] = [12, 6];
  let pTails: [number, number][] = Array.from({ length: 9 }, () => [12, 6]);

  const lines = [...input.lines];
  while (true) {
    const move = lines.shift();
    if (!move) break;
    [pHead, ...pTails] = doMove([pHead, ...pTails], move);
  }

  // console.log(" heads:", heads);

  return heads.size;
}
