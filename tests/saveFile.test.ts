import { describe, it, expect, vi, beforeEach } from "vitest";
import { appendFileSync, readFileSync, readdirSync } from "fs";
import { saveGrid, loadSaveFile, fetchSaveFiles, type SaveFile } from "../src/models/SaveFile";
import { createGrid } from "../src/models/Grid";
import type { User } from "../src/models/User";

// SaveFile.ts talks to the real filesystem; mock it so these stay unit tests
// with no side effects, instead of writing into public/assets/.
vi.mock("fs", () => ({
  appendFileSync: vi.fn(),
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
}));

const user: User = { id: "abc", username: "Test User!", color: "#112233" };

describe("saveGrid", () => {
  beforeEach(() => {
    vi.mocked(appendFileSync).mockClear();
  });

  it("serializes the grid into a 32x32 byte buffer and writes it under public/assets", () => {
    const grid = createGrid(32);
    grid[0][0].value = 7;
    grid[31][31].value = 9;

    const saveFile = saveGrid(grid, user);

    expect(saveFile.path).toBe("public/assets/");
    expect(saveFile.name).toBe("Test_User_"); // non-alphanumeric chars stripped
    expect(saveFile.format).toBe(".bin");
    expect(saveFile.uri).toBe(saveFile.path + saveFile.name + saveFile.id + saveFile.format);

    expect(appendFileSync).toHaveBeenCalledTimes(1);
    const [uri, bytes] = vi.mocked(appendFileSync).mock.calls[0];
    expect(uri).toBe(saveFile.uri);
    expect((bytes as Uint8Array).length).toBe(32 * 32);
    expect((bytes as Uint8Array)[0]).toBe(7);
    expect((bytes as Uint8Array)[32 * 32 - 1]).toBe(9);
  });
});

describe("loadSaveFile", () => {
  it("rehydrates a grid's cell values from a saved buffer", () => {
    const buffer = new Uint8Array(32 * 32);
    buffer[5] = 3; // x=0, y=5 (index = x*32 + y)
    vi.mocked(readFileSync).mockReturnValue(buffer as unknown as ReturnType<typeof readFileSync>);

    const saveFile: SaveFile = {
      id: "id1",
      path: "public/assets/",
      name: "someone",
      format: ".bin",
      uri: "public/assets/someone-id1.bin",
    };
    const grid = loadSaveFile(saveFile);

    expect(readFileSync).toHaveBeenCalledWith(saveFile.uri);
    expect(grid[0][5].value).toBe(3);
  });

  it("does not stamp the loading user onto cells — the .bin format never stored attribution", () => {
    const buffer = new Uint8Array(32 * 32);
    vi.mocked(readFileSync).mockReturnValue(buffer as unknown as ReturnType<typeof readFileSync>);

    const saveFile: SaveFile = {
      id: "id2",
      path: "public/assets/",
      name: "someone",
      format: ".bin",
      uri: "public/assets/someone-id2.bin",
    };
    const grid = loadSaveFile(saveFile);

    expect(grid[0][0].username).toBeNull();
    expect(grid[0][0].color).toBeNull();
  });
});

describe("fetchSaveFiles", () => {
  it("builds a SaveFile record from filenames in the directory", () => {
    vi.mocked(readdirSync).mockReturnValue(["alice-1.bin", "bob-2.bin"] as unknown as ReturnType<
      typeof readdirSync
    >);

    const files = fetchSaveFiles("public/assets/");
    const names = Object.values(files).map((f) => f.name);
    const formats = Object.values(files).map((f) => f.format);

    expect(Object.keys(files)).toHaveLength(2);
    expect(names).toEqual(expect.arrayContaining(["alice-1", "bob-2"]));
    expect(formats.every((f) => f === ".bin")).toBe(true);
  });
});
