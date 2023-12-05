export interface Input {
  lines: number[][];
}

export function parse(file: string): Input {
  return {
    lines: file.split("\n").map(line => [...line].map(str => parseInt(str))),
  };
}
