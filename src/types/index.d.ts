export {};

declare global {
  interface Array<T> {
    sum(): T;
    grouped(groupSize: number): T[][];
    rotateCW(): T[];
    rotateACW(): T[];
    take(length: number): T[];
    slidingG(windowLength: number): Generator<T[], null, unknown>;
  }
}
