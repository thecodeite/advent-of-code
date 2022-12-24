import { Vector } from "../Vector";
import { Cardinals, Compass, Diags, Elf, Input } from "./parse";

const look: Record<Cardinals, Compass[]> = {
  [Cardinals.N]: [Cardinals.N, Diags.NW, Diags.NE],
  [Cardinals.S]: [Cardinals.S, Diags.SE, Diags.SW],
  [Cardinals.W]: [Cardinals.W, Diags.NW, Diags.SW],
  [Cardinals.E]: [Cardinals.E, Diags.SE, Diags.NE],
};

const nextCard: Record<Cardinals, Cardinals> = {
  [Cardinals.N]: Cardinals.S,
  [Cardinals.S]: Cardinals.W,
  [Cardinals.W]: Cardinals.E,
  [Cardinals.E]: Cardinals.N,
};

function listStarting(c: Cardinals) {
  let card = c;
  return Array.from({ length: 4 }).map(() => {
    const res = card;
    card = nextCard[card];
    return res;
  });
}
function rotate(c: Cardinals[]) {
  return listStarting(c[1]);
}

const deltas: Record<Compass, Vector> = {
  [Cardinals.N]: new Vector(0, -1),
  [Diags.NE]: new Vector(1, -1),
  [Cardinals.E]: new Vector(1, 0),
  [Diags.SE]: new Vector(1, 1),
  [Cardinals.S]: new Vector(0, 1),
  [Diags.SW]: new Vector(-1, 1),
  [Cardinals.W]: new Vector(-1, 0),
  [Diags.NW]: new Vector(-1, -1),
};

function dump(elves: Elf[]) {
  const left = elves.map(e => e.location.x).min();
  const right = elves.map(e => e.location.x).max();
  const top = elves.map(e => e.location.y).min();
  const bottom = elves.map(e => e.location.y).max();
  const o: string[] = [];

  o.push("    ");
  for (let col = left; col <= right; col++) {
    if (col === 0) {
      o.push("|");
      continue;
    }
    const v = col > 0 && col % 100 === 0 ? col / 100 : " ";
    o.push(v.toString());
  }
  o.push("\n    ");
  for (let col = left; col <= right; col++) {
    if (col === 0) {
      o.push("|");
      continue;
    }
    const val = Math.abs(col);
    const v = val > 0 && val % 10 === 0 ? (val / 10) % 10 : " ";
    o.push(v.toString());
  }
  o.push("\n    ");
  for (let col = left; col <= right; col++) {
    o.push((Math.abs(col) % 10).toString());
  }
  o.push("\n");

  for (let row = top; row <= bottom; row++) {
    o.push(row.toString().padStart(3, " ") + " ");
    for (let col = left; col <= right; col++) {
      const isElf = elves.find(
        e => e.location.x === col && e.location.y === row,
      );
      if (isElf) o.push(isElf.h ? "h" : isElf.id);
      else o.push(".");
    }
    o.push("\n");
  }

  console.log(o.join(""));
}

export function solve(input: Input) {
  const { elves } = input;

  dump(elves);

  let moves = [Cardinals.N, Cardinals.S, Cardinals.W, Cardinals.E];

  console.log("elves:", elves);

  for (let i = 0; i < 10; i++) {
    move(elves, moves);
    moves = rotate(moves);
    // console.log("elves:", elves);
  }

  const left = elves.map(e => e.location.x).min();
  const right = elves.map(e => e.location.x).max();
  const top = elves.map(e => e.location.y).min();
  const bottom = elves.map(e => e.location.y).max();

  let empty = 0;
  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      const isElf = elves.find(
        e => e.location.x === col && e.location.y === row,
      );
      if (!isElf) empty++;
    }
  }

  const width = right - left + 1;
  const height = bottom - top + 1;

  return [empty, width * height - elves.length];
}

function move(elves: Elf[], moves: Cardinals[]) {
  elves.forEach(elf => {
    elf.proposed = undefined;
    elf.h = !Object.values(deltas).some(d => {
      const at = elf.location.add(d);
      return elves.some(e => e.location.eq(at));
    });
  });

  elves.forEach(elf => {
    if (elf.h) return;
    const bestLook = moves.find(card => {
      const locs = look[card];
      for (const loc of locs) {
        const at = elf.location.add(deltas[loc]);
        if (elves.some(e => e.location.eq(at))) return false;
      }
      return true;
    });

    if (bestLook) {
      elf.proposed = elf.location.add(deltas[bestLook[0] as Compass]);
    }

    // console.log("elf:", elf);
  });

  const canMove = elves.filter(
    e =>
      e.proposed && !elves.some(e2 => e !== e2 && e2.proposed?.eq(e.proposed)),
  );

  // console.log("canMove:", canMove);

  canMove.forEach(e => {
    if (!e.proposed) throw `no e.proposed`;
    e.location = e.proposed;
    e.proposed = undefined;
  });

  dump(elves);
}

// Guess 3846 - too low
// Guess 3925
