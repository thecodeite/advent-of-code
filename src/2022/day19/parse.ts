export interface Blueprint {
  id: number;
  oreCostOre: number;
  clayCostOre: number;
  obCostOre: number;
  obCostClay: number;
  geoCostOre: number;
  geoCostOb: number;
}

export interface Input {
  blueprints: Blueprint[];
}

export function parse(file: string): Input {
  const blueprints = file.split("\n").map(line => {
    const match = line.match(
      /Blueprint (?<id>\d+): Each ore robot costs (?<oreCostOre>\d+) ore. Each clay robot costs (?<clayCostOre>\d+) ore. Each obsidian robot costs (?<obCostOre>\d+) ore and (?<obCostClay>\d+) clay. Each geode robot costs (?<geoCostOre>\d+) ore and (?<geoCostOb>\d+) obsidian./,
    );

    const blueprint = Object.fromEntries(
      Object.entries(match!.groups!).map(([k, v]) => [k, parseInt(v)]),
    ) as unknown as Blueprint;

    return blueprint;
  });

  return { blueprints };
}
