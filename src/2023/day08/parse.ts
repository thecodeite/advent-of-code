type Direction = 0 | 1;

export interface Input {
  directions: Direction[];
  lines: string[];
  map: Map<string, [string, string]>;
}

const lineMatch = /(...) = \((...), (...)\)/;

export function parse(file: string): Input {
  const lines = file.split("\n");
  const directions = [...lines[0]].map(c => (c === "L" ? 0 : 1));

  const map = new Map<string, [string, string]>();

  lines.slice(2).forEach(line => {
    const [key, left, right] = lineMatch.exec(line)!.slice(1);
    map.set(key, [left, right]);
  });

  return { lines, directions, map };
}
