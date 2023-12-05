import { Cube, Input } from "./parse";
import { buildMinimumSpanTree } from "../utils/find-route";

const vectors: [number, number, number][] = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
];

function moveCube(cube: Cube, [dx, dy, dz]: [number, number, number]): Cube {
  const x = cube.x + dx;
  const y = cube.y + dy;
  const z = cube.z + dz;

  return {
    x,
    y,
    z,
    id: `${x},${y},${z}`,
  };
}

class CubeV {
  cube: Cube;

  constructor(cube: Cube) {
    this.cube = cube;
  }

  neighbourCubes() {
    return vectors.map(d => moveCube(this.cube, d));
  }

  neighbours(others: CubeV[]) {
    return vectors.map(d => {
      const moved = moveCube(this.cube, d);
      return others.find(o => o.cube.id === moved.id);
    });
  }

  visibleFaces(others: CubeV[]) {
    return vectors
      .map(d => {
        const moved = moveCube(this.cube, d);
        return others.find(o => o.cube.id === moved.id) ? 0 : 1;
      })
      .sum();
  }
}

export function solve(input: Input) {
  const xs = input.cubes.map(c => c.x);
  const ys = input.cubes.map(c => c.y);
  const zs = input.cubes.map(c => c.z);
  const minX = xs.min() - 1;
  const maxX = xs.max() + 1;
  const minY = ys.min() - 1;
  const maxY = ys.max() + 1;
  const minZ = zs.min() - 1;
  const maxZ = zs.max() + 1;
  const volume = (maxX - minX) * (maxY - minY) * (maxZ - minZ);
  console.log("volume:", volume);
  const normalized = input.cubes.map(
    c => new CubeV(moveCube(c, [-minX, -minY, -minZ])),
  );

  const solid = Object.fromEntries(normalized.map(c => [c.cube.id, true]));

  const idMapEntries: [string, string[]][] = Array.from({ length: volume });
  const allCubes: CubeV[] = Array.from({ length: volume });
  let p = 0;
  for (let ix = 0; ix < maxX - minX; ix++) {
    for (let iy = 0; iy < maxY - minY; iy++) {
      for (let iz = 0; iz < maxZ - minZ; iz++) {
        const cube = new CubeV({
          x: ix,
          y: iy,
          z: iz,
          id: `${ix},${iy},${iz}`,
        });
        allCubes[p] = cube;
        const neighbours = cube.neighbourCubes();
        idMapEntries[p] = [
          cube.cube.id,
          neighbours.map(c => c.id).filter(id => !solid[id]),
        ];
        p++;
        // idMap[p] = neighbours.
      }
    }
  }

  const idMap = Object.fromEntries(idMapEntries);
  const tree = buildMinimumSpanTree(idMap, "0,0,0");

  const enclosed = allCubes.filter(c => !tree[c.cube.id] && !solid[c.cube.id]);

  return normalized
    .map(cv => cv.visibleFaces([...normalized, ...enclosed]))
    .sum();
}
