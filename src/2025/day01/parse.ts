import { dir } from "console";

export interface ParsedLine {
  text: string;
  dir: "L" | "R";
  steps: number;
  normalized: number;
}

export interface Input {
  lines: ParsedLine[];
}

export function parse(file: string): Input {
  const lines = file.split("\n").map(parseLine);

  return { lines };
}

function parseLine(text: string): ParsedLine {
  const dirUntested = text[0];
  if (dirUntested !== "L" && dirUntested !== "R") {
    throw new Error(`invalid direction ${dirUntested} in line ${text}`);
  }
  const dir = dirUntested as "L" | "R";

  const steps = Number(text.slice(1));
  if (isNaN(steps)) {
    throw new Error(`invalid steps ${text.slice(1)} in line ${text}`);
  }
  const normalized = dir === "L" ? -steps : steps;
  return {
    text,
    dir,
    steps,
    normalized,
  };
}
