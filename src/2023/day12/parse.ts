export interface Input {
  springRecords: SpringRecord[];
  lines: string[];
}

export interface SpringRecord {
  data: string;
  check: number[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");
  const springRecords = lines.map(line => {
    const [data, checkStr] = line.split(" ");
    const check = checkStr.split(",").map(num => parseInt(num, 10));
    return { data, check };
  });

  return { springRecords, lines };
}
