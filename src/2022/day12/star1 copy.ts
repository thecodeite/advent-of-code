// import { charRefA, Chart, Input, Vector } from "./parse";

// export function solve(input: Input) {
//   console.log("input.end:", input.end);
//   const moveSet = moveForward({}, {}, input, 0);
// }

// function dump(input: Input, dumpLog: Record<string, string>) {
//   const grid = Array.from({ length: input.chart.height })
//     .map((_, row) =>
//       Array.from({ length: input.chart.width })
//         .map(
//           (_, col) =>
//             dumpLog[`${col},${row}`] ??
//             String.fromCharCode(
//               charRefA + (input.chart.heights.get(`${col},${row}`) ?? 0),
//             ),
//         )
//         .join(""),
//     )
//     .join("\n");
//   console.log(grid);
// }

// function moveForward(
//   dumpLog: Record<string, string>,
//   history: Record<string, string>,
//   input: Input,
//   depth: number,
// ) {
//   if (input.start.toString() === input.end.toString()) {
//     dump(input, dumpLog);
//     throw "Finished!" + Object.keys(history).length;
//   }

//   const moveSet = moves(input.start, input.chart, input.end, history, depth);

//   if (depth > 120) {
//     dump(input, dumpLog);
//     throw "done ";
//   }
//   // if (moveSet.length === 0) {
//   //   dump(input, dumpLog);
//   //   throw "fail";
//   // }

//   // console.log("moveSet:", moveSet);
//   for (const pick of moveSet) {
//     console.log("pick:", pick);

//     moveForward(
//       { ...dumpLog, [input.start.toString()]: pick.symbolFrom(input.start) },
//       { ...history, [pick.toString()]: pick.symbolFrom(input.start) },
//       { ...input, start: pick },
//       depth + 1,
//     );
//   }
// }

// function e(at: Vector, chart: Chart) {
//   return chart.heights.get(at.toString());
// }

// function moves(
//   at: Vector,
//   chart: Chart,
//   target: Vector,
//   history: Record<string, string>,
//   depth: number,
// ) {
//   const elevation = e(at, chart) as number;

//   const options = [
//     at.down(),
//     ...(depth < 120 ? [] : [at.left()]),
//     at.up(),
//     at.right(),
//   ].filter(v => {
//     const str = v.toString();
//     if (history[str]) return false;
//     const elv = e(v, chart);
//     if (elv === 0) return false;
//     return elv && elv - 1 <= elevation;
//   });

//   const sorted = options
//     .map(o => ({ o, w: o.squDistTo(target) }))
//     .sort((a, b) => a.w - b.w);
//   // console.log("sorted:", sorted);

//   return sorted.map(ww => ww.o);
// }
