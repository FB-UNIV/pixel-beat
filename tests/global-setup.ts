import { mkdirSync } from "fs";

// sockets.ts calls fetchSaveFiles("public/assets/") at import time, so the
// directory must exist before any test file imports it.
export default function setup() {
  mkdirSync("public/assets", { recursive: true });
}
