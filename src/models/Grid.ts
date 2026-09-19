export interface Cell {
  username: string | null;
  color: string | null;
  value: number;
}

export type Grid = Cell[][];

export function createGrid(size = 32): Grid {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      username: null,
      color: null,
      value: 0,
    })),
  );
}
