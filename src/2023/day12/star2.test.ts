import { solveSpringRecord, unFold } from "./star2";

describe("solveSpringRecord", () => {
  it.each([
    [".", 1], //
    [". 1", 0], //
    [". 2", 0], //
    ["#", 0], //
    ["# 1", 1], //
    ["# 2", 0], //
    ["?", 1], //
    ["? 1", 1], //
    ["? 2", 0], //
    //
  ])("should solve single char %s", (line, expected) => {
    expect(solveSpringRecord(line)).toBe(expected);
  });

  it.each([
    //
    ["..", 1], //
    [".#", 0], //
    [".?", 1], //
    [".. 1", 0], //
    [".# 1", 1], //
    [".? 1", 1], //
    [".. 2", 0], //
    [".# 2", 0], //
    [".? 2", 0], //
    //
  ])("should solve double char, start '.' %s", (line, expected) => {
    expect(solveSpringRecord(line)).toBe(expected);
  });

  it.each([
    //
    ["#.", 0], //
    ["##", 0], //
    ["#?", 0], //
    ["#. 1", 1], //
    ["## 1", 0], //
    ["#? 1", 1], //
    ["#. 2", 0], //
    ["## 2", 1], //
    ["#? 2", 1], //
    //
  ])("should solve double char, start '#' %s", (line, expected) => {
    expect(solveSpringRecord(line)).toBe(expected);
  });

  it.each([
    //
    ["?.", 1], //
    ["?#", 0], //
    ["??", 1], //
    ["?. 1", 1], //
    ["?# 1", 1], //
    ["?? 1", 2], //
    ["?. 2", 0], //
    ["?# 2", 1], //
    ["?? 2", 1], //
    //
  ])("should solve double char, start '?' %s %s", (line, expected) => {
    expect(solveSpringRecord(line)).toBe(expected);
  });

  it.each([
    //
    ["???", 1], //
    ["??? 1", 3], //
    ["??? 2", 2], //
    ["??? 1,1", 1], //
    //
  ])("should solve triple char %s", (line, expected) => {
    expect(solveSpringRecord(line)).toBe(expected);
  });
});

it("should solve", () => {
  expect(solveSpringRecord("? 1 .")).toBe(0);
});

describe("calcCheck2 - examples", () => {
  it.each([
    //
    ["???.### 1,1,3", 1], //
    [".??..??...?##. 1,1,3", 4], //
    ["?#?#?#?#?#?#?#? 1,3,1,6", 1], //
    ["????.#...#... 4,1,1", 1], //
    ["????.######..#####. 1,6,5", 4], //
    ["?###???????? 3,2,1", 10], //
    //
  ])("should solve double char, start '?' %s %s", (line, expected) => {
    expect(solveSpringRecord(line)).toBe(expected);
  });
});

describe("calcCheck2 - examples folded", () => {
  it.each([
    //
    ["???.### 1,1,3", 1], //
    [".??..??...?##. 1,1,3", 16384], //
    ["?#?#?#?#?#?#?#? 1,3,1,6", 1], //
    ["????.#...#... 4,1,1", 16], //
    ["????.######..#####. 1,6,5", 2500], //
    ["?###???????? 3,2,1", 506250], //
    //
  ])("should solve double char, start '?' %s %s", (lineRaw, expected) => {
    const line = unFold(lineRaw);

    expect(solveSpringRecord(line)).toBe(expected);
  });
});

// describe("calcCheck2", () => {
//   it.each([
//     [".", []], //
//     ["#", [1]], //
//     [".#", [1]], //
//     ["#.", [1]], //
//     ["##", [2]], //
//     [".##", [2]], //
//     ["..##", [2]], //
//     [".##.", [2]], //
//     [".#.#.", [1, 1]], //
//   ])("should calc check", (input, expected) => {
//     expect(calcCheck2([...input])).toEqual(expected);
//   });
// });
