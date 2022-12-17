import { buildMinimumSpanTree } from "../utils/find-route";
import { permutator } from "../utils/permute";
import { Input, Room } from "./parse";

export interface RoomExt extends Room {
  distances: Record<string, { path: string[] }>;
}

function plotRoute(input: Input, valves: string[]) {
  let at = "AA";

  return valves.flatMap(valve => {
    const trees = buildMinimumSpanTree(input.idMap, at);
    const tree = trees[valve];
    // console.log("valve:", valve);

    if (!tree) throw `error, no route from ${at} to ${valve}`;
    // console.log("tree:", tree.path);
    at = valve;
    return [...tree.path, "o"];
  });
}

export function solve(input: Input) {
  // const routeYou = "II,JJ,o,II,AA,BB,o,CC,o,".split(",");
  // const routeEle = "DD,o,EE,FF,GG,HH,o,GG,FF,EE,o".split(",");
  const routeYou =
    "TC,SI,o,II,ZZ,o,BO,AO,o,VX,IF,o,DS,OU,EB,o,NP,WN,UH,o,OP,ZQ,o,MF,BH,o".split(
      ",",
    );
  // const routeEle =
  //   "MX,WG,o,XB,HM,IP,o,IU,DU,NH,o,DF,EZ,MT,o,XC,IS,o,OW,RI,KZ,o,GB,RW,o".split(
  //     ",",
  //   ); //2123
  // const routeEle =
  //   "MX,WG,o,XB,HM,IP,o,IU,DU,NH,o,DF,EZ,MT,o,XC,IS,o,WO,RW,o,GB,KZ,o".split(
  //     ",",
  //   ); //2147
  // const routeEle =
  //   "RN,MT,o,XC,IS,o,WO,RW,o,GB,KZ,o,RI,OW,IS,XC,MT,EZ,DF,NH,o,VE,ZK,WG,o".split(
  //     ",",
  //   ); // 2314
  // const routeEle =
  //   "RN,MT,o,XC,IS,o,WO,RW,o,GB,KZ,o,RI,OW,IS,XC,MT,DV,FR,WG,o,ZK,VE,NH,o,DU,IP,o".split(
  //     ",",
  //   ); //2326 ** Too low **
  // const routeEle =
  //   "RN,MT,XC,IS,o,WO,RW,o,GB,KZ,o,RI,OW,IS,XC,MT,o,DV,FR,WG,o,ZK,VE,NH,o,DU,IP,o".split(
  //     ",",
  //   ); //2341 ** Too low **
  // const routeEle =
  //   "RN,MT,XC,IS,WO,RW,o,GB,KZ,o,RI,OW,IS,o,XC,MT,o,DV,FR,WG,o,ZK,VE,NH,o,DU".split(
  //     ",",
  //   ); //2248
  // const routeEle =
  //   "RN,MT,XC,IS,o,OW,RI,KZ,o,GB,RW,o,WO,IS,XC,MT,o,DV,FR,WG,o,ZK,VE,NH,o,DU".split(
  //     ",",
  //   ); // 2317
  const valves = input.rooms.filter(r => r.rate > 0).map(r => r.id);
  // const ways = permutator("WG,NH,MT,RW,KZ,IS,IP".split(","));
  const ways = permutator("SI,ZZ,AO,IF,UH,EB,ZQ,BH".split(","));
  // 2389 ->'WG,IS,RW,KZ,MT,NH' // Too low
  // 2392 ->'WG,IS,RW,KZ,MT,IP,NH' //Not right
  // 2400 -> 'WG,IS,RW,KZ,MT,IP,NH' & 'ZZ,AO,IF,EB,UH,ZQ,BH,SI'
  const eleRoute = plotRoute(input, "WG,IS,RW,KZ,MT,IP,NH".split(","));
  const results = ways.map(way => {
    const route = plotRoute(input, way);
    return {
      route: route.slice(0, 26).join(),
      way: way.join(),
      distance: trySolution(input, route, eleRoute),
    };
  });

  const best = results.max(r => r.distance);
  // console.log(best);
  return best.distance;
}

function trySolution(input: Input, routeYou: string[], routeEle: string[]) {
  const routeYouClone = [...routeYou];
  const routeEleClone = [...routeEle];
  let released = 0;
  const open = [];
  let youRoomAt = input.rooms.find(r => r.id === "AA")!;
  let eleRoomAt = input.rooms.find(r => r.id === "AA")!;
  for (let tick = 1; tick <= 26; tick++) {
    released += open.map(r => r.rate).sum();
    // console.log(``);
    // console.log(`== Minute ${tick} ==`);
    // console.log(
    //   "Valves",
    //   open.map(r => r.id).join(),
    //   open.map(r => r.rate).sum(),
    // );

    {
      const to = routeYouClone.shift();

      if (to === "o") {
        if (youRoomAt.rate === 0) throw "open 0";
        // console.log(`You open ${youRoomAt.id}`);
        open.push(youRoomAt);
      } else {
        if (to) {
          if (!youRoomAt?.connectedTo.includes(to))
            throw `you cant move from ${
              youRoomAt.id
            } to ${to} ${routeYou.join()}`;
          // console.log(`You move to ${to}`);
          const roomTo = input.rooms.find(r => r.id === to);
          if (!roomTo) throw "err";

          youRoomAt = roomTo;
        }
      }
    }

    {
      const to = routeEleClone.shift();

      if (to === "o") {
        if (eleRoomAt.rate === 0) throw "open 0";
        // console.log(`Ele open ${eleRoomAt.id}`);
        open.push(eleRoomAt);
      } else {
        if (to) {
          if (!eleRoomAt?.connectedTo.includes(to))
            throw `ele cant move from ${
              eleRoomAt.id
            } to ${to} [${routeEle.join()}]`;
          // console.log(`Ele move to ${to}`);
          const roomTo = input.rooms.find(r => r.id === to);
          if (!roomTo) throw "err";

          eleRoomAt = roomTo;
        }
      }
    }
  }

  return released;
}
