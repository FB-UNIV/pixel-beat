import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer, type Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { io as ioClient, type Socket as ClientSocket } from "socket.io-client";
import type { AddressInfo } from "net";
import { unlinkSync } from "fs";
import { registerSocketHandlers } from "../src/sockets/sockets";
import { createGrid } from "../src/models/Grid";
import type { User } from "../src/models/User";
import type { SaveFile } from "../src/models/SaveFile";

describe("registerSocketHandlers", () => {
  let httpServer: HttpServer;
  let io: SocketIOServer;
  let port: number;
  const createdFiles: string[] = [];

  beforeAll(async () => {
    httpServer = createServer();
    io = new SocketIOServer(httpServer);
    registerSocketHandlers(io, createGrid(32));
    await new Promise<void>((resolve) => httpServer.listen(0, resolve));
    port = (httpServer.address() as AddressInfo).port;
  });

  afterAll(async () => {
    io.close();
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    for (const file of createdFiles) {
      try {
        unlinkSync(file);
      } catch {
        // already removed
      }
    }
  });

  // The server emits `init` synchronously as soon as it sees the connection,
  // so the `init` listener must be attached in the same tick the socket is
  // created — attaching it only after awaiting "connect" is racy and can
  // drop the event.
  function connectAndWaitForInit(): Promise<{
    client: ClientSocket;
    grid: unknown;
    saveFiles: unknown;
  }> {
    return new Promise((resolve, reject) => {
      const socket = ioClient(`http://localhost:${port}`, {
        transports: ["websocket"],
        forceNew: true,
      });
      socket.once("connect_error", reject);
      socket.once("init", (grid, saveFiles) => resolve({ client: socket, grid, saveFiles }));
    });
  }

  it("sends init with the current grid and save files on connect", async () => {
    const { client, grid, saveFiles } = await connectAndWaitForInit();
    expect(Array.isArray(grid)).toBe(true);
    expect((grid as unknown[]).length).toBe(32);
    expect(saveFiles).toEqual({});
    client.disconnect();
  });

  it("broadcasts update_cell after paint_cell with valid coordinates", async () => {
    const { client } = await connectAndWaitForInit();

    const updatePromise = new Promise<{ x: number; y: number; color: string; value: number }>(
      (resolve) => client.once("update_cell", resolve),
    );
    client.emit("paint_cell", { x: 3, y: 4 }, 1);

    const update = await updatePromise;
    expect(update.x).toBe(3);
    expect(update.y).toBe(4);
    expect(update.value).toBe(1);
    expect(typeof update.color).toBe("string");
    client.disconnect();
  });

  it("broadcasts update_user_list with the new username after update_username", async () => {
    const { client } = await connectAndWaitForInit();

    const updatePromise = new Promise<Record<string, User>>((resolve) =>
      client.once("update_user_list", resolve),
    );
    client.emit("update_username", "PixelPusher");

    const users = await updatePromise;
    const usernames = Object.values(users).map((u) => u.username);
    expect(usernames).toContain("PixelPusher");
    client.disconnect();
  });

  it("adds and removes a user from update_user_list on connect/disconnect", async () => {
    const { client: first } = await connectAndWaitForInit();

    const joinedPromise = new Promise<Record<string, User>>((resolve) =>
      first.once("update_user_list", resolve),
    );
    const { client: second } = await connectAndWaitForInit();
    const usersAfterJoin = await joinedPromise;
    expect(Object.keys(usersAfterJoin).length).toBeGreaterThanOrEqual(2);

    const leftPromise = new Promise<Record<string, User>>((resolve) =>
      first.once("update_user_list", resolve),
    );
    second.disconnect();
    const usersAfterLeave = await leftPromise;
    expect(Object.keys(usersAfterLeave).length).toBe(1);

    first.disconnect();
  });

  it("writes a save file and broadcasts update_save_files_list on save_grid, then reloads it via select_save_file", async () => {
    const { client } = await connectAndWaitForInit();

    const savedPromise = new Promise<Record<string, SaveFile>>((resolve) =>
      client.once("update_save_files_list", resolve),
    );
    client.emit("save_grid");

    const saveFiles = await savedPromise;
    const entries = Object.values(saveFiles);
    expect(entries).toHaveLength(1);
    createdFiles.push(entries[0].uri);

    const loadPromise = new Promise<unknown>((resolve) => client.once("load_grid", resolve));
    client.emit("select_save_file", entries[0].id);

    const grid = await loadPromise;
    expect(Array.isArray(grid)).toBe(true);
    expect((grid as unknown[]).length).toBe(32);
    client.disconnect();
  });

  // Regression tests for the crash bugs found in the /ecc:dev-team review:
  // both paint_cell and select_save_file used to throw on invalid input,
  // taking the whole server down for every connected client.
  it("ignores paint_cell with out-of-range coordinates instead of crashing", async () => {
    const { client } = await connectAndWaitForInit();

    let sawUpdate = false;
    client.on("update_cell", () => {
      sawUpdate = true;
    });
    client.emit("paint_cell", { x: -1, y: 99 }, 1);

    // Prove the connection (and server) survives: a subsequent valid paint
    // still works and broadcasts normally.
    const updatePromise = new Promise<{ x: number; y: number }>((resolve) =>
      client.once("update_cell", resolve),
    );
    client.emit("paint_cell", { x: 0, y: 0 }, 1);
    const update = await updatePromise;

    expect(sawUpdate).toBe(true); // only the valid paint's broadcast
    expect(update.x).toBe(0);
    expect(update.y).toBe(0);
    client.disconnect();
  });

  it("ignores select_save_file with an unknown id instead of crashing", async () => {
    const { client } = await connectAndWaitForInit();

    let sawLoad = false;
    client.on("load_grid", () => {
      sawLoad = true;
    });
    client.emit("select_save_file", "does-not-exist");

    // Prove the server is still alive by round-tripping a username change.
    const updatePromise = new Promise<Record<string, User>>((resolve) =>
      client.once("update_user_list", resolve),
    );
    client.emit("update_username", "StillAlive");
    const users = await updatePromise;

    expect(sawLoad).toBe(false);
    expect(Object.values(users).map((u) => u.username)).toContain("StillAlive");
    client.disconnect();
  });
});
