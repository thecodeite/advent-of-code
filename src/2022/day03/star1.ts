
function calcPriority(char: string) {
  if(char >= 'a' && char <= 'z') return char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  if(char >= 'A' && char <= 'Z') return char.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + 26;
  return 0;
}

function splitAndMatch(line: string){
  const left = line.substring(0, line.length/2).split('');
  const right = line.substring(line.length/2).split('');
  const common = left.find(c => right.includes(c)) ?? '';
  const p = calcPriority(common);

  // console.log([left.join(''), right.join(''), common, p]);
  return p;
}

export function star1(lines: string[]) {
  
  const sum = lines.map(splitAndMatch).sum();

  console.log('solution to star 1:', sum);
}