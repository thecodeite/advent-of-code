import { Input } from "./parse";

const numbersMap: Record<string, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const numberRegex = new RegExp(Object.keys(numbersMap).join("|"), "g");

export function solve(input: Input) {
  return input.lines
    .map((line, i) => {
      const numbers: number[] = [];

      for (let i = 0; i < line.length; i++) {
        const section = line.slice(i);
        Object.entries(numbersMap).forEach(([word, number]) => {
          if (section.startsWith(word)) {
            numbers.push(number);
          }
        });
        // const char = line[i];
        // if(char.match(/\d/)) {
        //   numbers.push(char);
        // } else if(char.match(/[a-z]/)) {
        //   const word = line.slice(i, i + 4);
        //   if(word in numbersMap) {
        //     numbers.push(word);
        //     i += 3;
        //   }
        // }
      }

      const first = numbersMap[numbers[0]];
      const last = numbersMap[numbers[numbers.length - 1]];
      // const lastNumber = [...line]
      //   .reverse()
      //   .findIndex(char => char.match(/\d/));

      const number = parseInt(first.toString() + last.toString());

      console.log(
        `${(i / 1000).toFixed(3).slice(2)}) ${number}: ${line}, ${numbers}`,
      );
      return number;
    })
    .sum();
}

// 53255 Too low
// 53298 Too high
