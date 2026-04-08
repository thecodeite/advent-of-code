import { Input } from "./parse";

export function solve(input: Input) {
  const max = {
    first: -1,
    second: -1,
    area: -1,
  };

  for (let first = 0; first < input.lines.length; first++) {
    const line1 = input.lines[first];
    for (let second = first + 1; second < input.lines.length; second++) {
      const line2 = input.lines[second];
      if (line1.x === line2.x || line1.y === line2.y) {
        continue;
      }
      const xDiff = Math.abs(line1.x - line2.x) + 1;
      const yDiff = Math.abs(line1.y - line2.y) + 1;

      const area = xDiff * yDiff;
      // console.log(
      //   `Area of (${input.lines[first].x}, ${input.lines[first].y}) and (${input.lines[second].x}, ${input.lines[second].y}) is ${area}`,
      // );

      if (area > max.area) {
        max.first = first;
        max.second = second;
        max.area = area;
      }
    }
  }

  return max.area;
}
