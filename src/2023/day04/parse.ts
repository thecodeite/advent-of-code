interface Card {
  cardId: number;
  winners: number[];
  yours: number[];
}

export interface Input {
  cards: Card[];
}

function isDef<T>(x: T | undefined): x is T {
  return x !== undefined;
}

function readNumbers(str: string): number[] {
  return str.split(' ').filter(isDef).filter(x => x.length > 0).map(x => parseInt(x, 10))
}

function mapCard(raw: string): Card {
  const [id, numbers] = raw.split(':');
  const [winnersStr, yoursStr] = numbers.split('|')
  return {
    cardId: parseInt(id.replace(/Card +/, ''), 10),
    winners: readNumbers(winnersStr),
    yours: readNumbers(yoursStr)
  }
}

export function parse(file: string): Input {
  return { cards: file.split("\n").map(mapCard) };
}
