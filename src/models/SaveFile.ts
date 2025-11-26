import { User } from "./User";
import { createGrid, Grid} from "./Grid";
import { randomUUID } from "crypto";
import { appendFileSync, readFileSync, readdirSync } from "fs";

export interface SaveFile {
  id: string;
  path: string;
  name: string;
  format: string;
  uri: string;
}

export function saveGrid(grid: Grid, user: User): SaveFile{
  
  // Init a SaveFile
  let saveFile:SaveFile = {
    id: randomUUID(),
    path: "public/assets/",
    name: user.username.replace(/[^a-zA-Z0-9]/g, "_"),
    format: ".bin",
    uri: ""
  };

  let binaryValues:Uint8Array = new Uint8Array(32*32);

  for(let x:number = 0; x <32; x++){
    for(let y:number = 0; y < 32; y++){
      let index = x * 32 + y
      binaryValues[index] = grid[x][y].value;
    }
  }

  saveFile.uri = saveFile.path + saveFile.name + saveFile.id + saveFile.format; 
  appendFileSync(saveFile.uri, binaryValues);
  
  console.log(user.username + " Saved the grid");
  
  return saveFile;
}

export function loadSaveFile(fileToLoad: SaveFile, user: User): Grid {
  // create an empty Grid
  let grid: Grid = createGrid(32);
  
  let buffer = new Uint8Array(32*32)
  buffer = readFileSync(fileToLoad.uri);

  for(let x = 0; x < 32; x++){
    for(let y = 0; y < 32; y++){
      let index = x * 32 + y;
      let cell = grid[x][y];

      cell.username = user.username;
      cell.color = user.color;
      cell.value = buffer[index];
    }
  }
  // go read the file 
  return grid;
}

export function fetchSaveFiles(relativePath: string): Record<string, SaveFile>{
  
  let directory = readdirSync(relativePath);
  let files:Record<string, SaveFile> = {};

  if(directory){
    directory.forEach(file => {
      
      console.log("Loading file : " + file)
      let fileName = file.split(".")[0];
      let fileExtension = '.' + file.split(".")[1];

      let saveFile:SaveFile = {
        id: randomUUID(),
        path: relativePath,
        name: fileName,
        format: fileExtension,
        uri: relativePath + fileName + fileExtension
      };

      files[saveFile.id] = saveFile;
    });
  }

  return files;
}
