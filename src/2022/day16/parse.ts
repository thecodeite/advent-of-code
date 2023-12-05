export interface Room {
  id: string;
  rate: number;
  connectedTo: string[];
}

export interface Input {
  rooms: Room[];
  map: Record<string, Room>;
  idMap: Record<string, string[]>;
}

export function parse(file: string): Input {
  const rooms = file.split("\n").map((line, i) => {
    const match = line.match(
      /Valve (?<id>\w\w) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<valves>.*)/,
    );

    const room: Room = {
      id: match?.groups?.id ?? "",
      rate: parseInt(match?.groups?.rate ?? ""),
      connectedTo: (match?.groups?.valves ?? "").split(", "),
    };

    return room;
  });
  const map = Object.fromEntries(rooms.map(r => [r.id, r]));
  const idMap = Object.fromEntries(rooms.map(r => [r.id, r.connectedTo]));
  return { rooms, map, idMap };
}
