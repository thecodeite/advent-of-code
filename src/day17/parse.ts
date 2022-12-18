export interface Input {
  moves: number[];
}

export function parse(file: string): Input {
  return {
    moves: file.split("").map(str => {
      if (str === "<") return -1;
      if (str === ">") return 1;
      throw "parse error";
    }),
  };
}
