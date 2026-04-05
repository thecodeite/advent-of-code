export interface Line {
  text: string;
}

export interface Input {
  lines: Line[];
}

export function parse(file: string): Input {
  const lines = file.split("\n").map(text => ({ text }));
  return { lines };
}
