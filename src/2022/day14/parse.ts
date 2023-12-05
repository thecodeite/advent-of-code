import { Vector } from "../../common/Vector";

export interface RockChain {
  nodes: Vector[];
}
export interface Input {
  chains: RockChain[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");
  const chains = lines.map(line => {
    const nodes = line.split(" -> ").map(pair => {
      const [x, y] = pair.split(",").map(n => parseInt(n));
      return { x, y } as Vector;
    });
    return { nodes };
  });

  return { chains };
}
