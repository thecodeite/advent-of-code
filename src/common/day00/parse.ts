export interface Input {
  lines: string[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");
  return { lines };
}
