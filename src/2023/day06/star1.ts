import { Input } from "./parse";

export function solve(input: Input) {
  console.log("input:", input);
  return input.races
    .map(race => {
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
    })
    .product();
}

// trying: 128700
