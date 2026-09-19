# Contributing to pixel-beat

pixel-beat is a realtime multiplayer pixel-canvas app: an Express 5 server
serves the static frontend and a Socket.io channel keeps every client's grid
in sync.

## Setup

1. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
2. `nvm install` (reads the pinned version from `.nvmrc`)
3. `git clone https://github.com/BoujuFrancoisPro/pixel-beat.git && cd pixel-beat`
4. `npm install` (a `postinstall` script creates `public/assets/` automatically)
5. `npm run start`, then open `http://localhost:8000/`

## Scripts

<!-- AUTO-GENERATED: source package.json "scripts" -->

| Command                | Runs                    | Description                                                              |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `npm run start`        | `ts-node src/server.ts` | Run the server directly from TypeScript source, listening on port 8000   |
| `npm run build`        | `tsc`                   | Type-check and compile `src/` to `dist/` per `tsconfig.json`             |
| `npm run prod`         | `node dist/server.js`   | Run the compiled build from `dist/server.js` (run `npm run build` first) |
| `npm test`             | `vitest run`            | Run the test suite once                                                  |
| `npm run test:watch`   | `vitest`                | Run the test suite in watch mode                                         |
| `npm run lint`         | `eslint .`              | Lint `src/` and `tests/`                                                 |
| `npm run lint:fix`     | `eslint . --fix`        | Lint and auto-fix what's safe to fix                                     |
| `npm run format`       | `prettier --write .`    | Format the repo                                                          |
| `npm run format:check` | `prettier --check .`    | Check formatting without writing (used in CI)                            |

<!-- /AUTO-GENERATED -->

No `.env`/`.env.example` file exists and no environment variables are read
(`grep -r process.env src public` returns nothing) — port (`8000`) and grid
size (`32`) are hardcoded in `src/server.ts`.

## Project layout

- `src/server.ts` — Express app entrypoint, mounts `public/` as static and wires Socket.io
- `src/models/` — `Grid`, `User`, `SaveFile` types and grid/save-file logic
- `src/sockets/sockets.ts` — all realtime event handling (see below)
- `public/` — static frontend: `index.html`, `style.css`, `scripts/main.js` (no bundler, no framework)

## Realtime event contract

<!-- AUTO-GENERATED: source src/sockets/sockets.ts -->

There is no REST/OpenAPI surface; the app's API is the Socket.io event set
registered in `registerSocketHandlers`:

| Direction       | Event                    | Payload                               | Behavior                                                            |
| --------------- | ------------------------ | ------------------------------------- | ------------------------------------------------------------------- |
| server → client | `init`                   | `(grid, saveFiles)`                   | Sent once on connect with current grid state and known save files   |
| server → client | `update_user_list`       | `users: Record<string, User>`         | Broadcast whenever a user connects, disconnects, or renames         |
| server → client | `update_cell`            | `{x, y, color, value}`                | Broadcast after any cell is painted                                 |
| server → client | `update_save_files_list` | `saveFiles: Record<string, SaveFile>` | Broadcast after a new save is written                               |
| server → client | `load_grid`              | `grid: Grid`                          | Broadcast after a save file is loaded, replacing client grids       |
| client → server | `paint_cell`             | `({x, y}, value: number)`             | Paints one cell with the sender's `color`/`username`                |
| client → server | `update_username`        | `newUsername: string`                 | Renames the connecting user                                         |
| client → server | `save_grid`              | —                                     | Serializes the current grid to a `.bin` file under `public/assets/` |
| client → server | `select_save_file`       | `fileId: string`                      | Loads a previously saved grid and broadcasts it to everyone         |

`User = {id, username, color}`, `Cell = {username, color, value}`, `Grid = Cell[][]` — see `src/models/`.
<!-- /AUTO-GENERATED -->

## Testing

Tests use [Vitest](https://vitest.dev) and live under `tests/`, one file per
`src/` module: `grid.test.ts`, `randomColor.test.ts`, `saveFile.test.ts`
(filesystem calls mocked — no disk writes), and `sockets.test.ts` (spins up a
real `http`+`Socket.io` server on an ephemeral port and drives it with
`socket.io-client`, including regression tests for the crash bugs below).
Run `npm test` once or `npm run test:watch` while developing.

## Code style

ESLint (flat config, `eslint.config.mjs`) + Prettier (`.prettierrc.json`) are
configured. `tsconfig.json` has `"strict": true`. Before opening a PR, run:

```bash
npm run build   # type-check
npm run lint    # eslint
npm run format:check
npm test
```

All four run in CI (`.github/workflows/ci.yml`) on every push/PR to `main`.

## PR checklist

- [ ] `npm run build` passes with no type errors
- [ ] `npm run lint` and `npm run format:check` pass (or run `npm run lint:fix` / `npm run format`)
- [ ] `npm test` passes
- [ ] Verified the change manually in the browser (`npm run start`)
- [ ] Updated `README.md` / this file if setup steps or scripts changed
- [ ] Updated the event table above if a Socket.io event was added, removed, or changed
