export {};

declare global {
  interface Array<T> {
    sum(): T;
    grouped(groupSize: number): T[][];
  }
}
