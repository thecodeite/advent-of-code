export type Line =
  | {
      cmd: "noop";
    }
  | {
      cmd: "addx";
      arg: number;
    };

export interface Input {
  lines: Line[];
}

export function parse(file: string): Input {
  return {
    lines: file.split("\n").map(line => {
      const [cmd, arg] = line.split(" ");
      if (cmd === "noop") {
        return { cmd: "noop" };
      } else if (cmd === "addx") {
        return { cmd: "addx", arg: parseInt(arg) };
      } else {
        throw "parse error";
      }
    }),
  };
}
