function readRange(range: string) {
  const [start, end] = range.split('-').map(s => parseInt(s));

  return {start, end}
}

function parseLine(line: string) {
  const [a,b] = line.split(',').map(readRange);
  if (a.start <= b.start && a.end >= b.end) return {a,b, in: true}
  if (b.start <= a.start && b.end >= a.end) return {a,b, in: true}
  return {a, b, in: false};
}

export function star1(lines: string[]) {
  const parsed = lines.map(parseLine).filter(p => p.in);

  console.log('solution to star 1:', parsed.length);
}