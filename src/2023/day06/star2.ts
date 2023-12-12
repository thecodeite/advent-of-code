import { Input } from "./parse";

export function solve(input: Input) {
  const { race } = input;

  const winners = Array.from({ length: race.time })
    .map((_, heldFor) => {
      const racingTime = race.time - heldFor;
      const distance = heldFor * racingTime;
      // console.log("distance:", distance);
      return distance;
    })
    .filter(x => x > race.distance).length;

  console.log("winners:", winners);
  return winners;
}

// trying: 39594072 -> correct! Took 6.5s
