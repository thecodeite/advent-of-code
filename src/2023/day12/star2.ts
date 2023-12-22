import { Input, SpringRecord } from "./parse";

export function solve(input: Input) {
  const res = input.unfoldedSpringRecords.map(record => {
    console.log(record);
    return solveSpringRecord(record);
  });
  return res.sum();
}

function solveSpringRecord(record: SpringRecord) {
  const { data, check } = record;
  const checkStr = check.join();
  const dataArr = [...data];
  const qCount = dataArr.filter(x => x === "?").length;
  const qPos = dataArr
    .map((x, i) => (x === "?" ? i : -1))
    .filter(x => x !== -1);
  const perms = 2 ** qCount;
  let possible = 0;
  for (let n = 0; n < perms; n++) {
    const qs = n.toString(2).padStart(qCount, "0");

    [...qs].forEach((q, i) => {
      dataArr[qPos[i]] = q === "0" ? "." : "#";
    });
    const str = dataArr.join("");
    const newCheck = calcCheck(str);
    const isMatch = newCheck === checkStr;
    // console.log(str, newCheck, isMatch);
    if (isMatch) {
      possible++;
    }
  }
  return possible;
  // console.log(qs);
}

function calcCheck(data: string) {
  const springs = data.split(/\.+/).map(spring => spring.length);
  // console.log("springs:", springs);
  return springs.filter(x => x > 0).join();
}
