
function calcPriority(char: string | undefined) {
  if (!char) throw new Error();
  if(char >= 'a' && char <= 'z') return char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  if(char >= 'A' && char <= 'Z') return char.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + 26;
  return 0;
}

function splitAndMatch(lines: string[]){
  const all = [...new Set(lines.join('').split(''))];
 
  const common = all.find(char => lines.every(line => line.includes(char)))
  const p = calcPriority(common);
  // return p;
  return p
}

export function star2(lines: string[]) {
  
  const groups = lines.grouped(3);
  // console.log('groups:', groups)
  const sum = groups.map(splitAndMatch).sum();

  console.log('solution to star 2:', sum);
}