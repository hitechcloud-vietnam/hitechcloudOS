import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetPathsPath = path.join(__dirname, "assetPaths.ts");
const authPanelPath = path.join(__dirname, "..", "components", "auth", "AuthPanel.tsx");
const marketplaceGalleryPath = path.join(__dirname, "..", "components", "marketplace", "MarketplaceGallery.tsx");

test("hitechcloud logo URL respects the Vite base URL", async () => {
  const source = await readFile(assetPathsPath, "utf8");

  assert.match(source, /export const hitechcloudLogoUrl = `\$\{import\.meta\.env\.BASE_URL\}logo\.svg`;/);
});

