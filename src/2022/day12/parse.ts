import { Vector } from "../../common/Vector";

export interface Chart {
  width: number;
  height: number;
  heights: Record<string, number>;
}

export interface Input {
  start: Vector;
  end: Vector;
  chart: Chart;
}

export const charRefA = "a".charCodeAt(0);

export function parse(file: string): Input {
  const lines = file.split("\n");
  let start: Vector | undefined;
  let end: Vector | undefined;
  const heights: Record<string, number> = {};
  lines.forEach((line, row) =>
    [...line].forEach((char, col) => {
      let height;
      if (char === "S") {
        start = new Vector(col, row);
        height = 1;
      } else if (char === "E") {
        end = new Vector(col, row);
        height = 26;
      } else {
        height = char.charCodeAt(0) - charRefA;
      }
      heights[`${col},${row}`] = height;
    }),
  );

  if (!start || !end) throw "no s or e";

  return {
    start,
    end,
    chart: {
      width: lines[0].length,
      height: lines.length,
      heights,
    },
  };
}
