import { Server, Socket } from "socket.io";
import { Grid, Cell } from "../models/Grid";
import { SaveFile, saveGrid, loadSaveFile, fetchSaveFiles } from "../models/SaveFile";
import { User } from "../models/User";
import { randomColor } from "../utils/randomColor";

const users: Record<string, User> = {};
const saveFiles: Record<string, SaveFile> = fetchSaveFiles("public/assets/");

export function registerSocketHandlers(io: Server, grid: Grid) {
  console.log("registered a handler");

  io.on("connection", (socket: Socket) => {
    // Create a new User
    const user: User = {
      id: socket.id,
      username: "Guest_" + socket.id.slice(0, 4),
      color: randomColor(),
    };
    console.log(user);

    // Add the user to the list
    users[socket.id] = user;

    io.emit("update_user_list", users);

    // Send him the good stuff
    socket.emit("init", grid, saveFiles);
    socket.on("paint_cell", ({ x, y }: { x: number; y: number }, value: number) => {
      const cell: Cell = grid[x][y];

      // Check if cell exists
      if (cell) {
        cell.value = value;
        cell.color = user.color;
        cell.username = user.username;
      }

      console.log(cell);
      // Update for all connected clients
      io.emit("update_cell", { x: x, y: y, color: cell.color, value: cell.value });
    });

    socket.on("update_username", (newUsername: string) => {
      // Get the username set on the client Side
      user.username = newUsername;

      // CHange the username of the corresponding user in the ServerUserList
      users[socket.id] = user;

      // Notify all clients that a user changed it's username
      io.emit("update_user_list", users);
    });

    socket.on("save_grid", () => {
      // Get the current ServerGrid and convert it to a saveFile
      const saveFile = saveGrid(grid, user);

      // If it worked add it to the serverSaveFiles List
      if (saveFile) saveFiles[saveFile.id] = saveFile;

      // Tell the users that a new saveFile is available
      io.emit("update_save_files_list", saveFiles);
    });

    socket.on("select_save_file", (fileId) => {
      const user = users[socket.id];

      console.log(user.username + " is loading file : " + fileId);
      grid = loadSaveFile(saveFiles[fileId], user);
      io.emit("load_grid", grid);
    });

    socket.on("disconnect", () => {
      console.log(users[socket.id].id + " Disconnected");
      delete users[socket.id];
      io.emit("update_user_list", users);
    });
  });
}
