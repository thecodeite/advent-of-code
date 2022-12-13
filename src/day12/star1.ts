import { charRefA, Chart, Input, Vector } from "./parse";

interface All {
  parent: string;
  parentDir: string;
  cost: number;
}
export function solve(input: Input) {
  const all: Record<string, All> = {};
  all[input.start.toString()] = {
    parent: input.start.toString(),
    parentDir: "S",
    cost: 0,
  };

  calcWeights(input.chart, input.start, input.end, all, 1);
  // console.log("all:", all);
  // const allGrid = Object.fromEntries(
  //   Object.entries(all).map(([k, v]) => [k, v.parentDir]),
  // );
  // dump(input, allGrid);
  const solution = all[input.end.toString()];
  // console.log("input.start:", input.start);
  return solution?.cost;
}

function dump(input: Input, dumpLog: Record<string, string>) {
  const grid = Array.from({ length: input.chart.height })
    .map((_, row) =>
      Array.from({ length: input.chart.width })
        .map(
          (_, col) =>
            dumpLog[`${col},${row}`] ??
            String.fromCharCode(
              charRefA + input.chart.heights[`${col},${row}`],
            ),
        )
        .join(""),
    )
    .join("\n");
  console.log(grid);
}

function calcWeights(
  chart: Input["chart"],
  at: Vector,
  end: Vector,
  all: Record<string, All>,
  cost: number,
) {
  const elevation = chart.heights[at.toString()];
  const allOptions: [Vector, string][] = [
    [at.right(), ">"],
    [at.down(), "v"],
    [at.up(), "^"],
    [at.left(), "<"],
  ];

  const validOptions = allOptions.filter(([v]) => {
    const cord = v.toString();
    const targetEv = chart.heights[cord];
    if (targetEv === undefined || targetEv > elevation + 1) return false;
    const prev = all[cord];
    if (prev && prev.cost <= cost) return false;
    return true;
  });

  validOptions.forEach(([v, parentDir]) => {
    all[v.toString()] = {
      parent: at.toString(),
      parentDir,
      cost: cost,
    };
  });

  if (cost < 500) {
    validOptions.forEach(([v]) => {
      calcWeights(chart, v, end, all, cost + 1);
    });
  }
}
