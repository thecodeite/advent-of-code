import { buildMinimumSpanTree, TreeNode } from "../utils/find-route";
import { permutator } from "../utils/permute";
import { Input, Room } from "./parse";

export interface RoomExt extends Room {
  distances: Record<string, { path: string[] }>;
}

const cache: Record<string, Record<string, TreeNode | undefined>> = {};
function cachingBuildMinimumSpanTree(
  idMap: Record<string, string[]>,
  from: string,
) {
  if (cache[from]) return cache[from];
  cache[from] = buildMinimumSpanTree(idMap, from);
  return cache[from];
}

function plotRoute(input: Input, valves: string[]) {
  let at = "AA";

  return valves.flatMap(valve => {
    const trees = cachingBuildMinimumSpanTree(input.idMap, at);
    const tree = trees[valve];
    // console.log("valve:", valve);

    if (!tree) throw `error, no route from ${at} to ${valve}`;
    // console.log("tree:", tree.path);
    at = valve;
    return [...tree.path, "o"];
  });
}

export function solve(input: Input) {
  const ways = permutator("SI,ZZ,AO,IF,UH,EB,ZQ,BH".split(","));
  // console.log("ways.length:", ways.length);
  const results = ways.map(way => {
    const route = plotRoute(input, way);
    return {
      way: route.slice(0, 26).join(),
      distance: trySolution(input, plotRoute(input, way)),
    };
  });

  const best = results.max(r => r.distance);
  // console.log(best);
  return best.distance;
}

function trySolution(input: Input, routeYou: string[]) {
  const route = [...routeYou];
  let released = 0;
  const open = [];
  let roomAt = input.rooms.find(r => r.id === "AA")!;
  for (let tick = 1; tick <= 30; tick++) {
    released += open.map(r => r.rate).sum();
    // console.log(``);
    // console.log(`== Minute ${tick} ==`);
    // console.log(
    //   "Valves",
    //   open.map(r => r.id).join(),
    //   open.map(r => r.rate).sum(),
    // );
    const to = route.shift();

    if (to === "o") {
      if (roomAt.rate === 0) throw "open 0";
      // console.log(`You open ${roomAt.id}`);
      open.push(roomAt);
      continue;
    }

    if (to) {
      if (!roomAt?.connectedTo.includes(to))
        throw `cant move from ${roomAt.id} to ${to}`;
      const roomTo = input.rooms.find(r => r.id === to);
      if (!roomTo) throw "err";

      roomAt = roomTo;
    }
  }

  return released;

  // const tree = buildMinimumSpanTree(input.idMap, "AA");
  // const t = 30;
  // const order = input.rooms
  //   .filter(r => r.rate > 0)
  //   .map(r => {
  //     const route = tree[r.id];
  //     const distance = route?.distance ?? Number.POSITIVE_INFINITY;
  //     const value = r.rate * (t - distance * 2);
  //     return {
  //       id: r.id,
  //       v: value,
  //       rate: r.rate,
  //       route: route?.path,
  //     };
  //   })
  //   .sort((a, b) => b.v - a.v);
  // console.log("order:", order);

  // return planRoute("AA", ["AA"], input.map).length;
}

function calcDistance(from: string, to: string, map: Record<string, Room>) {}

// function planRoute(
//   start: string,
//   routeRouteSoFar: string[],
//   map: Record<string, Room>,
// ): string[][] {
//   if (routeRouteSoFar.length > 10) return [routeRouteSoFar];

//   const options = map[start].connectedTo;
//   // const visited = new Set(routeRouteSoFar);

//   // const unvisited = options.removed(visited);
//   // const unvisited = options.removed(visited);
//   // console.log("options:", options);
//   // console.log("visited:", visited);
//   // console.log("unvisited:", unvisited);

//   const routes = [...options].flatMap(picked => {
//     const route2 = planRoute(picked, [...routeRouteSoFar, picked], map);
//     const route1 = planRoute(picked, [...routeRouteSoFar, picked, "Op"], map);

//     return [...route1, ...route2];
//   });
//   return routes;
// }
