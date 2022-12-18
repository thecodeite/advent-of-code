export interface Cube {
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface Input {
  cubes: Cube[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");

  const cubes = lines
    .map(line => line.split(",").map(n => parseInt(n)))
    .map(([x, y, z]) => ({ x, y, z, id: `${x},${y},${z}` }));

  return { cubes };
}
