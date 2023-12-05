export interface Input {
  lines: string[];
}

export function parse(file: string): Input {
  return { lines: file.split("\n") };
}
