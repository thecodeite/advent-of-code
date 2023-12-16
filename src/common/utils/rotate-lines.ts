export function rotateLinesCw(lines: string[]): string[] {
  const height = lines.length;
  const width = lines.map(line => line.length).max();
  const rows = Array.from({ length: width }, (_, y) =>
    Array.from({ length: height }, (_, x) => lines[height - 1 - x][y]).join(""),
  );

  return rows;
}
export function rotateLinesCcw(lines: string[]): string[] {
  const height = lines.length;
  const width = lines.map(line => line.length).max();
  const rows = Array.from({ length: width }, (_, y) =>
    Array.from({ length: height }, (_, x) => lines[x][width - 1 - y]).join(""),
  );

  return rows;
}
