import * as fs from 'node:fs/promises';

const file = await fs.readFile('./src/day01/data.txt', 'utf8');

const elves = file.split('\n\n')
  .map(e => e.split('\n').map(c => parseInt(c, 10)).reduce((p,c) => p+c))

console.log(elves);
console.log('single max:', Math.max(...elves));
console.log('three max:', [...elves].sort((a, b) => b-a).slice(0, 3).reduce((p,c) => p+c))



