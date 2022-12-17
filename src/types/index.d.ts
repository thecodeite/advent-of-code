export {};

declare global {
  interface Array<T> {
    sum(): number;
    product(): number;
    max(): number;
    max(fn: (item: T) => number): T;
    min(): number;
    min(fn: (item: T) => number): T;
    grouped(groupSize: number): T[][];
    rotateCW(): T[];
    rotateACW(): T[];
    take(length: number): T[];
    slidingG(windowLength: number): Generator<T[], null, unknown>;
    reverseSafe(): T[];
  }

  interface String {
    stripPrefix(prefix: string): string;
    stripPostfix(prefix: string): string;
  }

  interface Set<T> {
    removed(toRemove: Set<t>): Set<t>;
  }
}
