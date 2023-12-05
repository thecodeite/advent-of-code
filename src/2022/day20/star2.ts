import { Input } from "./parse";

const FgRed = "\x1b[31m";
const Reset = "\x1b[0m";

interface Data {
  n: number;
  i: number;
  o: number;
  id: string;
}

let nextId = 0;
function makeId() {
  nextId++;
  return nextId.toString().padStart(5, "0");
}

export function solve(input: Input) {
  const length = input.entries.length;
  const modLength = input.entries.length - 1;
  const mod = (n: number) => {
    return ((n % modLength) + modLength) % modLength;
  };

  const withKey = input.entries.map(n => n * 811589153);
  const withI = withKey.map((n, i) => ({ n, i, id: makeId() }));
  const withO = withI.sort((a, b) => a.n - b.n).map((x, o) => ({ ...x, o }));

  const origOrder = withO.sort((a, b) => a.i - b.i);

  let sorting = [...origOrder];

  const move = (target: Data, from: number, to: number) => {
    if (to === from) {
      return;
    } else {
      sorting.splice(from, 1);
      sorting.splice(to, 0, target);
    }
  };

  for (let time = 0; time < 10; time++) {
    for (let current = 0; current < length; current++) {
      const currentPos = sorting.findIndex(x => x?.i === current);
      const target = sorting[currentPos];
      if (!target) throw "err1";

      const { n } = target;
      const from = sorting.findIndex(x => x?.id === target.id);
      const toMod = mod(from + n);
      const to = toMod === 0 ? length - 1 : toMod;

      // console.log(`Move ${FgRed}${n}${Reset} from ${from} to ${to}`);
      move(target, from, to);
      // dump(sorting, "moved " + target.n, x => x.id === target.id);
    }
  }

  const zero = sorting.findIndex(x => x?.n === 0);

  const a = sorting[(zero + 1000) % length].n;
  const b = sorting[(zero + 2000) % length].n;
  const c = sorting[(zero + 3000) % length].n;

  console.log("[a,b,c]:", [a, b, c]);
  return [a, b, c].sum();
}

function dumpS(arr: Data[], focus?: (x: Data) => boolean) {
  return (
    "[" +
    arr
      .map(item => {
        if (item === null) {
          return "xx";
        }
        const str = item.n.toString().padStart(2, " ");
        if (focus && focus(item)) {
          return `${FgRed}${str}${Reset}`;
        }
        return str;
      })
      .join(", ") +
    "]"
  );
}
function dump(arr: Data[], str?: string, focus?: (x: Data) => boolean) {
  console.log(dumpS(arr, focus) + " " + (str ?? ""));
}
