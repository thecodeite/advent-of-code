export function lcm(...numbers: number[]): number {
  return numbers.reduce((a, b) => lcm2(a, b));
}

export function lcm2(a: number, b: number): number {
  return (a * b) / gcd2(a, b);
}

export function gcd(...numbers: number[]): number {
  return numbers.reduce((a, b) => gcd2(a, b));
}

export function gcd2(a: number, b: number): number {
  return b === 0 ? a : gcd2(b, a % b);
}
