import { Cord, Input } from "./parse";

interface Distance {
  key: string;
  distSq: number;
  a: Cord;
  b: Cord;
}

// interface Circuit {
//   id: number;
//   cords: Cord[];
// }

class Circuit {
  private static nextId = 0;
  id: number;
  cords: Cord[];

  constructor(cords: Cord[]) {
    this.id = Circuit.nextId++;
    this.cords = cords;
  }

  toString() {
    return `[${this.id}: ${this.cords.map(cord => `(${cord.x},${cord.y},${cord.z})`).join(", ")}]`;
  }
}

export function solve(input: Input) {
  const distances: Distance[] = [];
  const circuits: Circuit[] = [];
  let result = 0;

  const lineCount = input.lines.length;
  for (let i = 0; i < lineCount; i++) {
    const line1 = input.lines[i];
    for (let j = i + 1; j < lineCount; j++) {
      const line2 = input.lines[j];
      const xDiff = Math.abs(line1.cord.x - line2.cord.x);
      const yDiff = Math.abs(line1.cord.y - line2.cord.y);
      const zDiff = Math.abs(line1.cord.z - line2.cord.z);
      const distSq = xDiff * xDiff + yDiff * yDiff + zDiff * zDiff;
      const key = `${line1.text}-${line2.text}`;
      distances.push({ key, distSq, a: line1.cord, b: line2.cord });
    }
  }

  console.log(`distances calculated`);
  console.timeLog("star2");

  distances.sort((a, b) => a.distSq - b.distSq);
  const disconnectedCords = new Set(input.lines.map(line => line.cord));

  for (
    let wireCount = 0;
    disconnectedCords.size > 0 && wireCount < 10000;
    wireCount++
  ) {
    const dist = distances[wireCount];
    const { a, b } = dist;
    let circuitA = circuits.find(circuit => circuit.cords.includes(a));
    let circuitB = circuits.find(circuit => circuit.cords.includes(b));
    if (circuitA && circuitB) {
      if (circuitA.id === circuitB.id) {
        continue;
      } else {
        const newCircuit = new Circuit([...circuitA.cords, ...circuitB.cords]);
        circuits.push(newCircuit);
        circuits.splice(circuits.indexOf(circuitA), 1);
        circuits.splice(circuits.indexOf(circuitB), 1);
      }
    } else if (circuitA) {
      circuitA.cords.push(b);
    } else if (circuitB) {
      circuitB.cords.push(a);
    } else {
      circuits.push(new Circuit([a, b]));
    }

    disconnectedCords.delete(a);
    disconnectedCords.delete(b);

    if (disconnectedCords.size === 0) {
      console.log("last cords connected at wire count", wireCount, a, b);
      result = a.x * b.x;
    }
  }

  return result;
}
