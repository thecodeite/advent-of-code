export interface Input {
  grids: string[][];
}

export function parse(file: string): Input {
  const grids = file.split("\n\n").map(grid => grid.split("\n"));
  return { grids };
}
