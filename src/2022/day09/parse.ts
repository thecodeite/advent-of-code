export interface Move {
  d: "R" | "L" | "U" | "D";
  s: number;
}

export interface Input {
  lines: Move[];
}

export function parse(file: string): Input {
  return {
    lines: file
      .split("\n")
      .map(l => l.split(" "))
      .map(([d, s]) => ({ d: d as "R" | "L" | "U" | "D", s: parseInt(s) })),
  };
}
