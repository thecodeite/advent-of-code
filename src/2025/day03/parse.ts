export interface Line {
  text: string;
  batteries: number[];
}

export interface Input {
  lines: Line[];
}

export function parse(file: string): Input {
  const lines = file.split("\n").map(text => {
    const batteries = text.split("").map(Number);
    return { text, batteries };
  });
  return { lines };
}
