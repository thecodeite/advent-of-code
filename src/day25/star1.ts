import { repeat } from "../util";
import { Input } from "./parse";
/*
 1    1
 2    2
 3   1=
 4   1-
 5   10
 6   11
 7   12
 8   2=
 9   2-
10   20
11   21
12   22
13  1== 
14  1=-
15  1=0
16  1=1
17  1=2
18  1-=
19  1--
20  1-0
21  1-1
22  1-2
23  10=
24  10-
25  100

*/
// "=" = -1
// "-" = -2

/*
                     2  2 *   1 
                10 + 2  2 *   5
           50 + 10 + 2  2 *  25
     125 + 50 + 10 + 2  2 * 125

  3 1=
    10=
*/
export function solve(input: Input) {
  return toSnafu(input.lines.map(line => parseSnafu(line)).sum());
}

function test3(i: number) {
  const snafu = toSnafu(i);
  const back = parseSnafu(snafu);
  console.log(
    "..........",
    `${i}`.padStart(5, " "),
    "=",
    snafu.padStart(5, " "),
    "|",
    i.toString().padStart(5, " "),
    back.toString().padStart(5, " "),
  );

  if (back !== i) throw `wrong snafu:${snafu} (${back} != ${i})`;
}

const sMap: Record<string, number> = {
  "=": -2,
  "-": -1,
  "0": 0,
  "1": 1,
  "2": 2,
};

const b5Map: Record<string, string> = {
  "0": "00",
  "1": "01",
  "2": "02",
  "3": "1=",
  "4": "1-",
};

let nMap = Object.fromEntries(Object.entries(sMap).map(([a, b]) => [b, a]));

function test1(snafu: string, expected: number) {
  const value = parseSnafu(snafu);
  console.log({ value, expected, pass: value === expected });
}

function zeros(count: number) {
  return repeat("0", count);
}

function merge(parts: string[][]) {
  const length = parts.map(x => x.length).max();
  // console.log("parts:", parts, length);
  let carry = "0";
  let str = Array.from({ length })
    .map((_, i) => {
      const arr = parts.map(p => p[i]);
      arr.push(carry);
      carry = "0";
      // console.log("arr:", arr);
      const decs = arr.map(ch => sMap[ch] ?? 0);
      const sum = decs.sum();
      // console.log("sum:", sum, decs);
      if (sum <= 2) return nMap[sum];
      else if (sum === 3) {
        carry = "1";
        return "=";
      } else if (sum === 4) {
        carry = "1";
        return "-";
      } else throw "sum: " + sum;
    })
    .reverse()
    .join("");

  while (str[0] === "0") str = str.stripPrefix("0");
  return str;
}

function toSnafu(num: number) {
  const parts = [...num.toString(5)]
    .reverse()
    .map((c, i) => [...(b5Map[c] + zeros(i))].reverse());
  try {
    return merge(parts);
  } catch (e) {
    console.log("num.toString(5):", num.toString(5));
    console.log("num:", num);
    console.log(
      "parts:",
      parts.map(p => p.join("")),
    );
    throw e;
  }
}

function toSnafuX(num: number) {
  const base5 = [...num.toString(5)].reverse();

  let carry = 0;
  let snafu = base5.map(ch => {
    let cch = (carry + parseInt(ch)).toString();

    if (cch === "0" || cch === "1" || cch === "2") {
      carry = 0;
      return cch;
    } else if (cch === "3" || cch === "4") {
      carry = 1;
      if (cch === "3") return "=";
      if (cch === "4") return "-";
    } else if (ch === "5") {
    } else {
      throw "overflow " + cch;
    }
  });

  if (carry) snafu.push("1");

  return snafu.reverse().join("");

  //  -2 > 2     5
  // -12 > 12   25
  // -62 > 62  125
  let total = 0;
  let n = 0;
  let pow;
  console.log("num:", num);
  do {
    pow = Math.pow(5, n);
    n++;

    total += pow * 2;
  } while (num >= total && n < 10);

  let v = num;
  let res = "";
  if (v <= 12 && v > 2) {
    let posVal = v - 2;
  }
  if (v <= 2) {
    res += nMap[v];
  }

  return res;

  return "";
}

function parseSnafu(line: string) {
  return [...line].reverse().reduce((p, c, i) => {
    const power = Math.pow(5, i);
    const num = sMap[c] * power;
    // console.log("num, i, power:", num, i, power);
    return p + num;
  }, 0);
}

// Try: 2=0--0---11--01=-100
