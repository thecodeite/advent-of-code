export interface Input {
  entries: number[];
}

export function parse(file: string): Input {
  return { entries: file.split("\n").map(l => parseInt(l)) };
}
