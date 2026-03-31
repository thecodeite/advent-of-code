export interface Line {
  text: string;
  start: number;
  end: number;
  length: number;
}

export interface Input {
  lines: Line[];
}

export function parse(file: string): Input {
  const lines = file.split(",").map(text => {
    const [start, end] = text.split("-").map(Number);
    const length = end - start + 1;
    return { text, start, end, length };
  });

  return { lines };
}
