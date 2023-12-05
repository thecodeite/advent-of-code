import * as fs from 'node:fs/promises';

const file = await fs.readFile('./src/day02/data.txt', 'utf8');

const games = file.split('\n');
// const games = `A Y
// B X
// C Z`.split('\n')

// A: Rock      1
// B: Paper     2
// C: Scissors  3

// X: lose
// Y: draw
// Z: win

const simpleScoreMap: Record<string, number> = {
  'A X': 1 + 3,
  'A Y': 2 + 6,
  'A Z': 3 + 0,

  'B X': 1 + 0,
  'B Y': 2 + 3,
  'B Z': 3 + 6,

  'C X': 1 + 6,
  'C Y': 2 + 0,
  'C Z': 3 + 3,
}

type Shape = 'A' | 'B' | 'C'

const value: Record<Shape, number> = {
  'A': 1,
  'B': 2,
  'C': 3,
}
const loseAgainst: Record<Shape, Shape> = {
  'A': 'C',
  'B': 'A',
  'C': 'B',
}
const winAgainst: Record<Shape, Shape> = {
  'A': 'B',
  'B': 'C',
  'C': 'A',
}

function loseTo(shape: Shape) {
  return 0 + value[loseAgainst[shape]];
}
function drawTo(shape: Shape) {
  return 3 + value[shape];
}
function winTo(shape: Shape) {
  return 6 + value[winAgainst[shape]];
}

const outcomeScoreMap: Record<string, number> = {
  'A X': loseTo('A'), // lose to Rock -> Scissors = 0 + 3 = 3
  'A Y': drawTo('A'), // draw to Rock -> Rock     = 3 + 1 = 4
  'A Z': winTo('A'), // win to  Rock -> Paper    = 6 + 2 = 8

  'B X': loseTo('B'),
  'B Y': drawTo('B'),
  'B Z': winTo('B'),

  'C X': loseTo('C'),
  'C Y': drawTo('C'),
  'C Z': winTo('C'),
}

function calcScore(game: string) {
  return outcomeScoreMap[game];
}

const simpleScore = games.map(game => simpleScoreMap[game]).reduce((p, c) => p +c);
const advancedScore = games.map(game => calcScore(game)).reduce((p, c) => p +c);
console.log('simpleScore', simpleScore)
console.log('advancedScore', advancedScore)



