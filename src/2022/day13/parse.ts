export type Packet = (number | Packet)[];

export interface Pair {
  a: Packet;
  b: Packet;
}

export interface Input {
  pairs: Pair[];
}

export function dump(packet: Packet): string {
  return (
    "[" +
    packet
      .map(p => {
        if (Array.isArray(p)) return dump(p);
        else return p.toString();
      })
      .join() +
    "]"
  );
}

export function parse(file: string): Input {
  const pairs = file.split("\n\n").map(pair => pair.split("\n"));

  return {
    pairs: pairs.map(([p1, p2]) => {
      const a = JSON.parse(p1) as Packet;
      const b = JSON.parse(p2) as Packet;
      return { a, b };
    }),
  };
}
