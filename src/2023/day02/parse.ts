interface Game {
  number: string;
  summary: string;
  rounds: {
    red: number;
    green: number;
    blue: number;
  }[];
}

export interface Input {
  games: Game[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");

  const games = lines.map((line, index) => {
    const rounds = line
      .split(";")
      .map(round => {
        return {
          red: parseInt(round.match(/(\d+) red/)?.[1] || "0"),
          green: parseInt(round.match(/(\d+) green/)?.[1] || "0"),
          blue: parseInt(round.match(/(\d+) blue/)?.[1] || "0"),
        };
      })
      .filter(round => Object.keys(round).length > 0);

    return {
      number: (index + 1).toString(),
      summary: rounds.map(r => `R${r.red},G${r.green},B${r.blue}`).join("; "),
      rounds,
    };
  });

  return { games };
}
