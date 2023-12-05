import { Cube, Input } from "./parse";

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
  const cubeVs = input.cubes.map(cube => new CubeV(cube));

  return cubeVs.map(cv => cv.visibleFaces(cubeVs)).sum();
}
