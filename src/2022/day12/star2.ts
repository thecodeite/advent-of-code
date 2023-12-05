import { Vector } from "../../common/Vector";
import { charRefA, Chart, Input } from "./parse";

interface All {
  parent: string;
  parentDir: string;
  cost: number;
  elevation: number;
}
export function solve(input: Input) {
  const reverseInput: Input = {
    ...input,
    start: input.end,
    end: input.start,
  };

  const all: Record<string, All> = {};
  all[reverseInput.start.toString()] = {
    parent: reverseInput.start.toString(),
    parentDir: "S",
    cost: 0,
    elevation: reverseInput.chart.heights[reverseInput.start.toString()],
  };

  calcWeights(reverseInput.chart, reverseInput.start, reverseInput.end, all, 1);

  // const allGrid = Object.fromEntries(
  //   Object.entries(all).map(([k, v]) => [k, v.parentDir]),
  // );
  // dump(input, allGrid);
  const solution = Object.values(all)
    .filter(a => a.elevation === 0)
    .map(x => x.cost)
    .min();
  // console.log("input.start:", input.start);
  return solution;
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
    [at.down(), "^"],
    [at.up(), "v"],
    [at.left(), ">"],
  ];

  const validOptions = allOptions.filter(([v]) => {
    const cord = v.toString();
    const targetEv = chart.heights[cord];
    if (targetEv === undefined || targetEv < elevation - 1) return false;
    const prev = all[cord];
    if (prev && prev.cost <= cost) return false;
    return true;
  });

  validOptions.forEach(([v, parentDir]) => {
    all[v.toString()] = {
      parent: at.toString(),
      parentDir,
      cost: cost,
      elevation: chart.heights[v.toString()],
    };
  });

  if (cost < 500) {
    validOptions.forEach(([v]) => {
      calcWeights(chart, v, end, all, cost + 1);
    });
  }
}
