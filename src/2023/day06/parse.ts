export interface Input {
  races: {
    time: number;
    distance: number;
  }[];
  race: {
    time: number;
    distance: number;
  };
}

export function parse(file: string): Input {
  const [timesString, distancesString] = file.split("\n");

  const times = timesString.match(/\d+/g)?.map(x => parseInt(x, 10) ?? 0) ?? [];
  const distances =
    distancesString.match(/\d+/g)?.map(x => parseInt(x, 10) ?? 0) ?? [];

  const races = times.map((time, index) => ({
    time,
    distance: distances[index],
  }));

  const time = parseInt(timesString.replace(/\D+/g, ""));
  const distance = parseInt(distancesString.replace(/\D+/g, ""));

  return { races, race: { time, distance } };
}
