export interface Input {
  lines: { hand: string; bid: number }[];
}

export function parse(file: string): Input {
  return {
    lines: file.split("\n").map(line => {
      const [hand, bid] = line.split(" ");
      return { hand, bid: Number(bid) };
    }),
  };
}
