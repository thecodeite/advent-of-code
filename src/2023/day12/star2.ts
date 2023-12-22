import { Input } from "./parse";

export function solve(input: Input) {
  const { lines } = input;
  const res = lines.map(line => {
    const unfolded = unFold(line);
    return solveSpringRecord(unfolded);
  });
  return res.sum();
}

function isNext(next: string | undefined): next is "." | "#" | undefined {
  return next === "." || next === "#" || next === undefined;
}

const memo = new Map<string, number>();

function parseLine(line: string) {
  const [data, checkStr, next] = line.split(" ");
  if (!isNext(next)) throw new Error(`Not a next: >${next}<`);
  const check = checkStr
    ? checkStr.split(",").map(num => parseInt(num, 10))
    : [];
  return { data: [...data], check, next };
}

// export function solveLine(line: string) {
//   // if (memo.has(line)) return memo.get(line)!;

//   console.log(`"${line}" = ${result}`);
//   memo.set(line, result);
//   return result;
// }

export function solveSpringRecord(line: string): number {
  if (memo.has(line)) return memo.get(line)!;

  const { data, check, next } = parseLine(line);

  const answer = (() => {
    const [char, ...rest] = data;

    if (next && char !== "?" && next !== char) {
      return 0;
    }

    if (rest.length === 0) {
      if (check.length > 1) return 0;
      if (char === "?") {
        if (next === "." && check.length > 0) return 0;
        if (next === "#" && check.length === 0) return 0;
        if (check.length === 0) return 1;
        return check[0] === 1 ? 1 : 0;
      } else if (char === ".") {
        if (check.length === 0) return 1;
        return 0;
      } else if (char === "#") {
        if (check.length === 0) return 0;
        return check[0] === 1 ? 1 : 0;
      }
    } else {
      if (char === ".") {
        return solveSpringRecord(`${rest.join("")} ${check.join()}`);
      } else if (char === "#") {
        if (check.length === 0) return 0;
        const [first, ...restCheck] = check;
        if (first === 1) {
          return solveSpringRecord(`${rest.join("")} ${restCheck.join()} .`);
        } else {
          return solveSpringRecord(
            `${rest.join("")} ${[first - 1, ...restCheck].join()} #`,
          );
        }
      } else if (char === "?") {
        const withHash = solveSpringRecord(
          `${["#", ...rest].join("")} ${check.join()}${next ? ` ${next}` : ""}`,
        );
        const withDot = solveSpringRecord(
          `${[".", ...rest].join("")} ${check.join()}${next ? ` ${next}` : ""}`,
        );

        return withHash + withDot;
      }
      throw new Error("Not implemented");
    }
    throw new Error("Not possible");
  })();

  memo.set(line, answer);
  return answer;
}

export function unFold(line: string) {
  const [data, checkStr] = line.split(" ");
  const unfoldedData = `${data}?${data}?${data}?${data}?${data}`;
  const unfoldedSpringRecords = `${checkStr},${checkStr},${checkStr},${checkStr},${checkStr}`;

  return `${unfoldedData} ${unfoldedSpringRecords}`;
}

// 1st guess: 1493340882140 (Took 3.7 seconds) -> Correct!
