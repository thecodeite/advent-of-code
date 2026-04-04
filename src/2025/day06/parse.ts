export interface Line1 {
  text: string;
  columns: number[];
}

export interface Line2 {
  op: "*" | "+";
  numbers: number[];
}

interface Operation {
  symbol: "*" | "+";
  size: number;
}

export interface Input1 {
  lines: Line1[];
  operations: Operation[];
}

export interface Input2 {
  lines: Line2[];
}

export function parse1(file: string): Input1 {
  const textLines = file.split("\n");
  const textOperations = textLines.pop();

  const lines = textLines.map(text => {
    const columns = text.trim().split(/\s+/).map(Number);
    return { text, columns };
  });

  const operations = (textOperations?.trim().split(/\s+/) ?? []).map(
    symbol => ({ symbol: symbol as "*" | "+", size: 0 }),
  );

  console.log("lines:", lines);

  return { lines, operations };
}

export function parse2(file: string): Input2 {
  const textLines = file.split("\n");

  const grid = textLines
    .map(line => line.split(""))
    .rotateACW()
    .map(row => row.join("").trim())
    .join(";")
    .split(";;")
    .map(line => line.split(";"));
  // console.log("grid:", grid);

  const lines: Line2[] = grid.map(group => {
    const last = group.pop() ?? "";
    const op = last.slice(-1) as "*" | "+";
    const lastNum = last.slice(0, -1);
    return { op, numbers: [...group, lastNum].map(s => s.trim()).map(Number) };
  });

  return { lines };
}

interface Acc {
  columns: string[];
  text: string;
}
