import { Input, Move } from "./parse";

const heads = new Set<String>();

function drawGrid([[hx, hy], [tx, ty]]: [number, number][], size: number) {
  console.log("[tx, ty]:", [tx, ty]);
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      if (hx === x && hy === y) {
        process.stdout.write("H");
      } else if (tx === x && ty === y) {
        process.stdout.write("T");
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
  [pHead, pTail]: [number, number][],
  move: Move,
): [number, number][] {
  let pNewHead: [number, number] = pHead;
  let pNewTail: [number, number] = pTail;
  for (let s = 0; s < move.s; s++) {
    pNewHead = doUnitMove(pNewHead, move.d);
    pNewTail = catchHead([pNewHead, pNewTail]);
    // drawGrid([pNewHead, pNewTail], 6);
    heads.add(`${pNewTail[0]},${pNewTail[1]}`);
  }

  return [pNewHead, pNewTail];
}

export function solve(input: Input) {
  let pHead: [number, number] = [0, 0];
  let pTail: [number, number] = [0, 0];

  const lines = [...input.lines];
  while (true) {
    const move = lines.shift();
    if (!move) break;
    [pHead, pTail] = doMove([pHead, pTail], move);
  }

  // console.log(" heads:", heads);

  return heads.size;
}
