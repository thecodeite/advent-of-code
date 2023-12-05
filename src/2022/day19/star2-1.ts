import { writeFileSync } from "node:fs";
import { Blueprint, Input } from "./parse";

const minutesAvailable = 24;

const traceLog: string[] = [];
const trace = (arg?: string) => {
  traceLog.push(arg ?? "");
};

interface State {
  oreBots: number;
  ore: number;
  clayBots: number;
  clay: number;
  obBots: number;
  ob: number;
  geoBots: number;
  geo: number;
  actions: Actions[];
}

enum Actions {
  Nothing = "n",
  OreBot = "o",
  ClayBot = "c",
  ObsidianBot = "b",
  GeodeBot = "g",
}

const botNames: Record<Actions, string> = {
  [Actions.Nothing]: "nothing",
  [Actions.OreBot]: "ore-collecting",
  [Actions.ClayBot]: "clay-collecting",
  [Actions.ObsidianBot]: "obsidian-collecting",
  [Actions.GeodeBot]: "geode-cracking",
};

function createNewState(): State {
  const state = {
    oreBots: 1,
    ore: 0,
    clayBots: 0,
    clay: 0,
    obBots: 0,
    ob: 0,
    geoBots: 0,
    geo: 0,
    actions: [],
  };
  return state;
}

const solutions = {
  /* cSpell:disable */
  //  12345678901234567890123456789012
  1: "nnnnoncccccccbnbbnbgbgggnggngggn".split(""),
  /* cSpell:enable */
} as Record<number, Actions[]>;

function* possibleActions(
  blueprint: Blueprint,
  state: State,
  isCorrectSoFar: boolean,
  skip: Actions[],
): Generator<Actions, undefined, undefined> {
  const minute = state.actions.length + 1;
  if (minute === minutesAvailable) return;

  if (
    !skip.includes(Actions.GeodeBot) &&
    state.ore >= blueprint.geoCostOre &&
    state.ob >= blueprint.geoCostOb
  ) {
    yield Actions.GeodeBot;
    // return;
  }

  //const actions: Actions[] = [Actions.Nothing];

  const maxOre = Math.max(
    blueprint.clayCostOre,
    blueprint.obCostOre,
    blueprint.geoCostOre,
  );

  let allowOre = !skip.includes(Actions.OreBot) && state.oreBots < maxOre;
  let allowClay =
    !skip.includes(Actions.ClayBot) && state.clayBots < blueprint.obCostClay;
  let allowOb = !skip.includes(Actions.ObsidianBot);
  const blockers = [];

  const left = minutesAvailable - minute;

  // if (state.oreBots * left + state.ore > maxOre * left) allowOre = false;
  // if (state.clayBots * left + state.clay > blueprint.obCostClay * left)
  //   allowClay = false;
  // if (state.obBots * left + state.ob > blueprint.geoCostOb * left)
  //   allowOb = false;

  if (state.obBots > 4) allowClay = false;

  // if (minute === 23) {
  //   console.log("23. allowOre:", allowOre);
  // }

  /* Geo Start */
  // if (state.obBots > 0) {
  //   const geoBotEtaCurrent = Math.ceil(
  //     Math.max(
  //       (blueprint.geoCostOre - state.ore) / state.oreBots,
  //       (blueprint.geoCostOb - state.ob) / state.obBots,
  //     ),
  //   );

  //   const geoBotEtaBuildOb = Math.ceil(
  //     Math.max(
  //       (blueprint.geoCostOre - state.ore + blueprint.obCostOre) /
  //         state.oreBots,
  //       (blueprint.geoCostOb - state.ob) / (state.obBots + 1),
  //     ),
  //   );
  //   if (geoBotEtaCurrent < geoBotEtaBuildOb) {
  //     allowOb = false;
  //     blockers.push("geo blocks ob");
  //   }

  //   const geoBotEtaBuildClay = Math.ceil(
  //     Math.max(
  //       (blueprint.geoCostOre - state.ore + blueprint.clayCostOre) /
  //         state.oreBots,
  //       (blueprint.geoCostOb - state.ob) / state.obBots,
  //     ),
  //   );
  //   if (geoBotEtaCurrent < geoBotEtaBuildClay) {
  //     allowClay = false;
  //     blockers.push("geo blocks clay");
  //   }

  //   if (allowOre) {
  //     const geoBotEtaBuildOre = Math.ceil(
  //       Math.max(
  //         (blueprint.geoCostOre - state.ore + blueprint.oreCostOre) /
  //           (state.oreBots + 1),
  //         (blueprint.geoCostOb - state.ob) / state.obBots,
  //       ),
  //     );
  //     if (geoBotEtaCurrent < geoBotEtaBuildOre) {
  //       allowOre = false;
  //       blockers.push("geo blocks ore");
  //     }
  //   }

  //   // if (minute === 11) {
  //   //   console.log("geo", { allowOre, allowClay, allowOb });
  //   //   console.log({
  //   //     geoBotEtaCurrent,
  //   //     geoBotEtaBuildOb,
  //   //     geoBotEtaBuildClay,
  //   //   });
  //   // }
  // }
  /* Geo end */

  // max(etaOre, etaClay) vs max(etaOre-const, etaClay+1)

  /* Ob start */
  // if (state.clayBots > 0) {
  //   const obBotEtaCurrent = Math.ceil(
  //     Math.max(
  //       (blueprint.obCostOre - state.ore) / state.oreBots,
  //       (blueprint.obCostClay - state.clay) / state.clayBots,
  //     ),
  //   );

  //   const obBotEtaBuildClay = Math.ceil(
  //     Math.max(
  //       (blueprint.obCostOre - state.ore + blueprint.clayCostOre) /
  //         state.oreBots,
  //       (blueprint.obCostClay - state.clay) / (state.clayBots + 1),
  //     ),
  //   );

  //   if (obBotEtaCurrent < obBotEtaBuildClay) {
  //     allowClay = false;
  //     blockers.push("ob blocks clay");
  //   }

  //   if (allowOre) {
  //     const obBotEtaBuildOre = Math.ceil(
  //       Math.max(
  //         (blueprint.obCostOre - state.ore + blueprint.oreCostOre) /
  //           (state.oreBots + 1),
  //         (blueprint.obCostClay - state.clay) / state.clayBots,
  //       ),
  //     );

  //     if (obBotEtaCurrent < obBotEtaBuildOre) {
  //       allowOre = false;
  //       blockers.push("ob blocks ore");
  //     }
  //   }
  // }
  /* Ob end */

  /* Clay start */
  // if (allowOre) {
  //   const targetClayBots = 2;
  //   const clayBotEtaCurrent = Math.ceil(
  //     (blueprint.clayCostOre * targetClayBots - state.ore) / state.oreBots,
  //   );

  //   const clayBotEtaBuildOre = Math.ceil(
  //     (blueprint.clayCostOre * targetClayBots -
  //       state.ore +
  //       blueprint.oreCostOre) /
  //       (state.oreBots + 1),
  //   );

  //   if (clayBotEtaCurrent < clayBotEtaBuildOre) {
  //     allowOre = false;
  //     blockers.push(
  //       `clay blocks ore ${clayBotEtaCurrent} < ${clayBotEtaBuildOre}`,
  //     );
  //   }
  // }
  /* Clay end */

  // if (minute === 5) {
  //   console.log("5. blockers:", blockers);
  // }

  // if (state.oreBots > 4) allowOre = false;
  // if (minutesAvailable - state.actions.length === 12) {
  //   console.log({ allowOre, allowClay, allowOb });
  // }

  // if (minute === 5) allowOre = false;
  // if (minute === 6) allowOre = false;
  // if (minute === 9) allowClay = false;
  // if (minute === 10) allowClay = true;

  // allowOre = state.oreBots < maxOre;
  // allowClay = true;
  // allowOb = true;

  // if (allowOb state.ore >= blueprint.obCostOre && state.clay >= blueprint.obCostClay) {
  //   yield Actions.ObsidianBot;
  // }

  if (
    allowOb &&
    state.ore >= blueprint.obCostOre &&
    state.clay >= blueprint.obCostClay
  ) {
    yield Actions.ObsidianBot;
  }

  if (allowClay && state.ore >= blueprint.clayCostOre) {
    yield Actions.ClayBot;
  }

  if (allowOre && state.ore >= blueprint.oreCostOre) {
    yield Actions.OreBot;
  }

  yield Actions.Nothing;

  return;
}

function applyAction(action: Actions, next: State, blueprint: Blueprint) {
  switch (action) {
    case Actions.OreBot: {
      return {
        ...next,
        oreBots: next.oreBots + 1,
        ore: next.ore - blueprint.oreCostOre,
        actions: [...next.actions, action],
      };
    }

    case Actions.ClayBot: {
      return {
        ...next,
        clayBots: next.clayBots + 1,
        ore: next.ore - blueprint.clayCostOre,
        actions: [...next.actions, action],
      };
    }
    case Actions.ObsidianBot: {
      return {
        ...next,
        obBots: next.obBots + 1,
        ore: next.ore - blueprint.obCostOre,
        clay: next.clay - blueprint.obCostClay,
        actions: [...next.actions, action],
      };
    }

    case Actions.GeodeBot: {
      return {
        ...next,
        geoBots: next.geoBots + 1,
        ore: next.ore - blueprint.geoCostOre,
        ob: next.ob - blueprint.geoCostOb,
        actions: [...next.actions, action],
      };
    }

    case Actions.Nothing: {
      return {
        ...next,
        actions: [...next.actions, action],
      };
    }
  }
}

function* continueBlueprint(
  blueprint: Blueprint,
  state: State,
  time: number,
  isCorrectSoFar: boolean,
  bestSoFar: number,
  skip: Actions[],
): Generator<State, number, number> {
  const timeLeft = minutesAvailable - time + 1;
  const bestCase =
    (timeLeft / 2) * (state.geoBots + state.geoBots + timeLeft - 1) + state.geo;
  // console.log("bestCase:", { bestCase, timeLeft }, state.actions.join());

  // let baseCase2 = state.geo;
  // let botCount = state.geoBots;
  // let t = time - 1;
  // while (t < minutesAvailable) {
  //   baseCase2 += botCount;
  //   botCount++;
  //   t++;
  // }

  // console.log("state:", state);
  // console.log("baseCase2:", baseCase2);

  // if (baseCase2 !== bestCase) throw `${baseCase2} != ${bestCase}`;
  // throw "stop";

  if (bestCase < bestSoFar) return bestSoFar;

  const actionsIt = possibleActions(blueprint, state, isCorrectSoFar, skip);

  // if (isCorrectSoFar) {
  //   const actionsIt2 = [...possibleActions(blueprint, state, isCorrectSoFar)];

  //   if (!actionsIt2.includes(solutions[blueprint.id][time - 1])) {
  //     console.log("state.actions:", state.actions.join());
  //     console.log(
  //       `Error at minute ${time}. Expected ${
  //         botNames[solutions[blueprint.id][time - 1]]
  //       } to be in ${actionsIt2}`,
  //     );
  //     throw "";
  //   }
  // }

  // actions.length = 0;
  // actions.push(solution);

  const next = {
    ...state,
    ore: state.ore + state.oreBots,
    clay: state.clay + state.clayBots,
    ob: state.ob + state.obBots,
    geo: state.geo + state.geoBots,
  };

  // recurse

  if (time < minutesAvailable) {
    // const newStates = applyActions(actions, next, blueprint);

    // console.log("newStates.length:", newStates.length);

    // const results = actions.flatMap(action => {
    //for (const action of actions) {
    // let n = actionsIt.next();
    let best = bestSoFar;
    let skip: Actions[] = [];
    for (const action of actionsIt) {
      // const action = n.value;
      if (action === Actions.Nothing) {
        skip = [...affordable(blueprint, state)];
      }
      best = yield* continueBlueprint(
        blueprint,
        applyAction(action, next, blueprint),
        time + 1,
        isCorrectSoFar && action === solutions[blueprint.id][time - 1],
        best,
        skip,
      );
      if (best > b) {
        // console.log("bestIn:", best);
        b = best;
      }
    }
  }

  // console.log("bestSoFar:", bestEnd);
  return yield next;
}

function* affordable(blueprint: Blueprint, state: State): Generator<Actions> {
  if (state.ore >= blueprint.geoCostOre && state.ob >= blueprint.geoCostOb) {
    yield Actions.ObsidianBot;
  }

  if (state.ore >= blueprint.obCostOre && state.clay >= blueprint.obCostClay) {
    yield Actions.ObsidianBot;
  }

  if (state.ore >= blueprint.clayCostOre) {
    yield Actions.ClayBot;
  }

  if (state.ore >= blueprint.oreCostOre) {
    yield Actions.OreBot;
  }
}

let b = -1;

function replayBlueprint(
  blueprint: Blueprint,
  state: State,
  actions: Actions[],
): State {
  trace(`== Minute ${minutesAvailable - actions.length} ==`);

  const [action, ...nextActions] = actions;

  function p(num: number, multi: string, single?: string) {
    return num === 1 ? single ?? "" : multi;
  }

  function countBots(action: Actions, state: State) {
    if (action === Actions.OreBot) return state.oreBots;
    if (action === Actions.ClayBot) return state.clayBots;
    if (action === Actions.ObsidianBot) return state.obBots;
    if (action === Actions.GeodeBot) return state.geoBots;
    return 0;
  }

  const botName = botNames[action];
  if (action === Actions.OreBot) {
    trace(
      `Spend ${blueprint.oreCostOre} ore to start building an ${botName} robot.`,
    );
  }
  if (action === Actions.ClayBot) {
    trace(
      `Spend ${blueprint.clayCostOre} ore to start building a ${botName} robot.`,
    );
  }
  if (action === Actions.ObsidianBot) {
    trace(
      `Spend ${blueprint.obCostOre} ore and ${blueprint.obCostClay} clay to start building an ${botName} robot.`,
    );
  }
  if (action === Actions.GeodeBot) {
    trace(
      `Spend ${blueprint.geoCostOre} ore and ${blueprint.geoCostOb} obsidian to start building a ${botName} robot.`,
    );
  }

  const next = {
    ...state,
    ore: state.ore + state.oreBots,
    clay: state.clay + state.clayBots,
    ob: state.ob + state.obBots,
    geo: state.geo + state.geoBots,
  };

  const minusCost = { ...next };
  if (action === Actions.OreBot) {
    minusCost.ore -= blueprint.oreCostOre;
  } else if (action === Actions.ClayBot) {
    minusCost.ore -= blueprint.clayCostOre;
  } else if (action === Actions.ObsidianBot) {
    minusCost.ore -= blueprint.obCostOre;
    minusCost.clay -= blueprint.obCostClay;
  } else if (action === Actions.GeodeBot) {
    minusCost.ore -= blueprint.geoCostOre;
    minusCost.ob -= blueprint.geoCostOb;
  }

  const status = (
    bots: number,
    total: number,
    botName: string,
    resourceName: string,
  ) => {
    if (bots === 0) return;
    const robot = p(bots, "robots", "robot");
    const collect = botName === "g" ? "crack" : "collect";
    const collectP = p(bots, collect, `${collect}s`);
    const open = botName === "g" ? "open " : "";
    const s1 = botName === "g" && bots > 1 ? "s" : "";
    const s2 = botName === "g" && total > 1 ? "s" : "";
    trace(
      `${bots} ${botName} ${robot} ${collectP} ${bots} ${resourceName}${s1}; you now have ${total} ${open}${resourceName}${s2}.`,
    );
  };

  status(state.oreBots, minusCost.ore, botNames[Actions.OreBot], "ore");
  status(state.clayBots, minusCost.clay, botNames[Actions.ClayBot], "clay");
  status(state.obBots, minusCost.ob, botNames[Actions.ObsidianBot], "obsidian");
  status(state.geoBots, minusCost.geo, botNames[Actions.GeodeBot], "geode");

  if (action && action !== Actions.Nothing) {
    trace(
      `The new ${botName} robot is ready; you now have ${
        countBots(action, state) + 1
      } of them.`,
    );
  }

  // recurse
  if (actions.length > 0) {
    trace();
    const nextState = applyAction(action, next, blueprint);
    return replayBlueprint(blueprint, nextState, nextActions);
  } else {
    return next;
  }
}

function runBlueprint(blueprint: Blueprint): State {
  b = 0;
  const state = createNewState();
  // const results = [...continueBlueprint(blueprint, state, 1, true)];
  const it = continueBlueprint(blueprint, state, 1, false, 0, []);
  let next = it.next(0);

  let best = next.value as State;
  let count = 1;
  while (!next.done) {
    if (next.value.geo > best.geo) {
      best = next.value;
    }
    next = it.next(best.geo);
    count++;
  }
  // console.log("blueprint", blueprint.id, "results.length:", count);
  return best;
  //const results = [...it];
  // const first = it.next().value;
  // if (first === null) throw "err";
  // console.log({ first });
  // return first;

  // const second = it.next().value;
  // const third = it.next().value;
  // const results = [first, second, third];
  // console.log("blueprint", blueprint.id, "results.length:", results.length);
  //return results.max(r => r.geo);
}

const calDate = process.env.CAL_DATE;

export function solve(input: Input) {
  const q = input.blueprints.map(blueprint => {
    // console.time(`blueprint ${blueprint.id}`);
    const best = runBlueprint(blueprint);
    // console.timeEnd(`blueprint ${blueprint.id}`);
    // console.log(`Best for blueprint ${blueprint.id} is ${best.geo}`);
    return best.geo * blueprint.id;
  });

  return q.sum();
  // const best1 = runBlueprint(input.blueprints[0]);
  // replayBlueprint(input.blueprints[0], createNewState(), best1.actions);
  // writeFileSync(`./src/day${calDate}/trace.txt`, traceLog.join("\n"));
  // traceLog.length = 0;

  // const best2 = runBlueprint(input.blueprints[1]);
  // replayBlueprint(input.blueprints[1], createNewState(), best2.actions);
  // writeFileSync(`./src/day${calDate}/trace2.txt`, traceLog.join("\n"));

  // return best.geo;
  // console.log({
  //   ...best2,
  //   actions: best2.actions
  //     .map((a, i) => ({ a, m: i + 1 }))
  //     .filter(({ a }) => a === "g"),
  // });
  // return [best1.geo, best2.geo];
}

export function solveDebug(input: Input) {
  let best1 = undefined as State | undefined;
  let best2 = undefined as State | undefined;

  best1 = runBlueprint(input.blueprints[0]);
  replayBlueprint(input.blueprints[0], createNewState(), best1.actions);
  writeFileSync(`./src/day${calDate}/s2-trace.txt`, traceLog.join("\n"));
  traceLog.length = 0;

  best2 = runBlueprint(input.blueprints[1]);
  replayBlueprint(input.blueprints[1], createNewState(), best2.actions);
  writeFileSync(`./src/day${calDate}/s2-trace2.txt`, traceLog.join("\n"));

  // return best.geo;
  // console.log({
  //   ...best2,
  //   actions: best2.actions
  //     .map((a, i) => ({ a, m: i + 1 }))
  //     .filter(({ a }) => a === "g"),
  // });
  // console.log("Solution 2", best2.actions);
  console.log(`Expect 56, 62`);
  return [best1?.geo, best2?.geo];
}

/*
  Guesses

  Guess 1: 6840
*/
