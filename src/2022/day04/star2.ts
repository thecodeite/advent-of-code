function readRange(range: string): {start: number, end: number} {
  const [start, end] = range.split('-').map(s => parseInt(s));

  return {start, end}
}

function parseLine(line: string) {
  const [a,b] = line.split(',').map(readRange);
  if (a.end >= b.start && a.start <= b.end) return {a, b, in: true}
  return {a, b, in: false};
}

export function star2(lines: string[]) {
  const parsed = lines.map(parseLine).filter(p => p.in);

  console.log('solution to star 2:', parsed.length);
}