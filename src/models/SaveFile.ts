import { User } from "./User";
import { createGrid, Grid } from "./Grid";
import { randomUUID } from "crypto";
import { appendFileSync, readFileSync, readdirSync } from "fs";

export interface SaveFile {
  id: string;
  path: string;
  name: string;
  format: string;
  uri: string;
}

export function saveGrid(grid: Grid, user: User): SaveFile {
  // Init a SaveFile
  const saveFile: SaveFile = {
    id: randomUUID(),
    path: "public/assets/",
    name: user.username.replace(/[^a-zA-Z0-9]/g, "_"),
    format: ".bin",
    uri: "",
  };

  const binaryValues: Uint8Array = new Uint8Array(32 * 32);

  for (let x: number = 0; x < 32; x++) {
    for (let y: number = 0; y < 32; y++) {
      const index = x * 32 + y;
      binaryValues[index] = grid[x][y].value;
    }
  }

  saveFile.uri = saveFile.path + saveFile.name + saveFile.id + saveFile.format;
  appendFileSync(saveFile.uri, binaryValues);

  console.log(user.username + " Saved the grid");

  return saveFile;
}

export function loadSaveFile(fileToLoad: SaveFile): Grid {
  // create an empty Grid
  const grid: Grid = createGrid(32);

  const buffer = readFileSync(fileToLoad.uri);

  // The .bin format only stores each cell's `value` byte — it never recorded
  // per-cell username/color, so a load leaves those null rather than
  // stamping the loading user onto every cell (that implied they painted
  // the whole grid, which isn't real data).
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      const index = x * 32 + y;
      grid[x][y].value = buffer[index];
    }
  }

  return grid;
}

export function fetchSaveFiles(relativePath: string): Record<string, SaveFile> {
  const directory = readdirSync(relativePath);
  const files: Record<string, SaveFile> = {};

  if (directory) {
    directory.forEach((file) => {
      console.log("Loading file : " + file);
      const fileName = file.split(".")[0];
      const fileExtension = "." + file.split(".")[1];

      const saveFile: SaveFile = {
        id: randomUUID(),
        path: relativePath,
        name: fileName,
        format: fileExtension,
        uri: relativePath + fileName + fileExtension,
      };

      files[saveFile.id] = saveFile;
    });
  }

  return files;
}
