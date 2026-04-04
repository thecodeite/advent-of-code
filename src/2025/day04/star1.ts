import { Point } from "../../common/Vector";
import { Input } from "./parse";

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

export function solve(input: Input) {
  let accessibleRoles = 0;
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
        if (neighbourLocation && neighbourLocation.char === "@") {
          neighboursWithRolls++;
        }
      }
      if (neighboursWithRolls < 4) {
        accessibleRoles++;
      }
    }
  }
  return accessibleRoles;
}

function addPoints(p1: Point, p2: Point): Point {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}
