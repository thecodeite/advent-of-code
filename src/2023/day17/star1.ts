import { Vector } from "../../common/Vector";
import { Input } from "./parse";

interface Route {
  cost: number;
  from: Vector;
  history: string;
}

interface Edge {
  cost: number;
  at: Vector;
}

const neighbours = [
  new Vector(0, -1),
  new Vector(-1, 0),
  new Vector(1, 0),
  new Vector(0, 1),
];

function paintVector(v: Vector) {
  if (v.x === 0 && v.y === 0) return "x";
  if (v.x === 0 && v.y === -1) return "^";
  if (v.x === 0 && v.y === 1) return "v";
  if (v.x === -1 && v.y === 0) return "<";
  if (v.x === 1 && v.y === 0) return ">";
  return "?";
}

function fr(route: Route | null) {
  if (!route) return "null";
  return `${route.cost}:${paintVector(route.from)}`;
}

export function solve(input: Input) {
  const lines = input.lines.map(line => [...line].map(Number));
  const height = lines.length;
  const width = lines[0].length;
  const routeMap = lines.map2d(() => [] as Route[]);
  const fromMap = lines.map2d(() => ".");

  // 4 1 1
  console.log(
    lines
      .map(line => line.map(n => (n === null ? "---" : n.pad(3))).join(" "))
      .join("\n"),
  );
  console.log();

  const dump = () => {
    console.log(
      routeMap
        .map(line =>
          line
            .map(n => {
              if (n.length === 0) return "----";
              if (n.length === 1) return n[0].cost.pad(4);
              if (n.length > 1) return "*" + n[0].cost.pad(3);
            })
            .join(" "),
        )
        .join("\n"),
    );
    console.log();
  };

  const dumpFromMap = () => {
    console.log(fromMap.map(line => line.join("")).join("\n"));
    console.log();
  };

  const fill = (pos: Vector, route: Route) => {
    if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) return;
    const arr = routeMap[pos.y][pos.x];
    arr.push(route);
    arr.sort((a, b) => a.cost - b.cost);
  };

  const fillFromMap = (pos: Vector, char: string) => {
    if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) return;
    fromMap[pos.y][pos.x] = char;
  };

  const sortEdges = () => {
    edges.sort((a, b) => {
      return a.cost - b.cost;
    });
  };

  const getHistory = (pos: Vector, length: number) => {
    const history: string[] = [];
    for (let i = 0; i < length; i++) {
      const route = lookRouteMap(pos);
      if (!route) break;
      const dir = paintVector(pos.sub(route[0].from));
      history.push(dir);
      pos = route[0].from;
    }
    return history;
  };

  const start = new Vector(0, 0);
  let mostRecent = start;
  const end = new Vector(width - 1, height - 1);
  fill(start, { cost: 0, from: start, history: "" });
  dump();
  const edges: Edge[] = [{ cost: 0, at: start }];

  const lookCity = (pos: Vector) => {
    if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
      return null;
    }
    return lines[pos.y][pos.x];
  };

  const lookRouteMap = (pos: Vector) => {
    if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
      return [];
    }
    return routeMap[pos.y][pos.x];
  };

  let loops = 0;
  while (edges.length > 0) {
    loops++;
    const edgeShifted = edges.shift()!;
    const edge = edgeShifted.at;
    mostRecent = edge;
    const routes = lookRouteMap(edge);

    if (routes.length === 0) continue;
    const route = routes[0];

    let exclude = "";
    const history = getHistory(edge, 3);
    const [back1, back2, back3] = history;
    if (back1 === back2 && back1 === back3) {
      exclude = back1;
    }
    // if (loops > 40) break;

    // TODO: remove "reverse" from neighbours
    for (const dir of neighbours) {
      const dirPained = paintVector(dir);
      if (dirPained === exclude) continue;

      const neighbour = edge.add(dir);
      const blockCost = lookCity(neighbour);
      if (!blockCost) continue;
      const currentRoute = lookRouteMap(neighbour);
      const newCost = route.cost + blockCost;

      fill(neighbour, { cost: newCost, from: edge, history: history.join("") });
      //fillFromMap(neighbour, paintVector(dir));
      edges.push({ cost: newCost, at: neighbour });
    }
    // sortEdges();
  }

  console.log("edges", edges);

  dump();

  let pos = end;
  for (let loops = 0; loops < 1000; loops++) {
    const route = lookRouteMap(pos);
    if (!route) continue;
    const from = route[0].from;
    fillFromMap(pos, paintVector(pos.sub(from)));
    pos = from;
    if (pos.eq(start)) break;
  }

  dumpFromMap();

  const history = getHistory(mostRecent, 2);
  console.log("history:", history);

  return input;
}
