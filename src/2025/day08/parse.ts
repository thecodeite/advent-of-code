export interface Line {
  text: string;
  cord: Cord;
}

export interface Cord {
  x: number;
  y: number;
  z: number;
}

export interface Input {
  lines: Line[];
}

export function parse(file: string): Input {
  const lines = file.split("\n").map(text => {
    const [x, y, z] = text.split(",").map(Number);
    return { text, cord: { x, y, z } };
  });
  return { lines };
}
