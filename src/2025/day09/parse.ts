export interface Line {
  text: string;
  x: number;
  y: number;
}

export interface Input {
  lines: Line[];
}

export function parse(file: string): Input {
  const lines = file.split("\n").map(text => {
    const [x, y] = text.split(",").map(Number);
    return { text, x, y };
  });
  return { lines };
}
