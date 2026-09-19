import { describe, it, expect } from "vitest";
import { createGrid } from "../src/models/Grid";

describe("createGrid", () => {
  it("creates a square grid of the requested size", () => {
    const grid = createGrid(4);
    expect(grid.length).toBe(4);
    expect(grid.every((row) => row.length === 4)).toBe(true);
  });

  it("defaults to a 32x32 grid", () => {
    const grid = createGrid();
    expect(grid.length).toBe(32);
    expect(grid[0].length).toBe(32);
  });

  it("initializes every cell to an empty, unpainted state", () => {
    const grid = createGrid(2);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell).toEqual({ username: null, color: null, value: 0 });
      }
    }
  });

  it("creates independent cell objects, not shared references", () => {
    const grid = createGrid(2);
    grid[0][0].value = 1;
    expect(grid[0][1].value).toBe(0);
    expect(grid[1][0].value).toBe(0);
  });
});
