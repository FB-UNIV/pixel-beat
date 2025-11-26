import express from "express";
import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/sockets";
import { createGrid } from "./models/Grid";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// DEFAULTS
const gridSize = 32;

//Init the grid with size 32

// Pass the grid to the socketHandler
registerSocketHandlers(io, createGrid(gridSize));

app.use(express.static("public"));

server.listen(8000, () => {
  console.log('Server is litening on port 8000');
});
