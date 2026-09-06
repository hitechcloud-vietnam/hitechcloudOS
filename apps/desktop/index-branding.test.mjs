import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, "index.html");

test("desktop shell uses hitechcloudOS branding in the initial window title and splash", async () => {
  const source = await readFile(indexPath, "utf8");

  assert.match(source, /<title>hitechcloudOS<\/title>/);
  assert.match(source, /<div class="boot-splash-title">hitechcloudOS<\/div>/);
  assert.doesNotMatch(source, /<title>Hitechcloud<\/title>/);
  assert.doesNotMatch(source, /<div class="boot-splash-title">Hitechcloud<\/div>/);
});
