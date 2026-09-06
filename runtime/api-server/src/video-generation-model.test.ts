import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";

import {
  defaultVideoGenerationModelForProvider,
  resolveVideoGenerationModelSelection,
} from "./video-generation-model.js";

const tempDirs: string[] = [];
const ORIGINAL_ENV = {
  HB_SANDBOX_ROOT: process.env.HB_SANDBOX_ROOT,
  HITECHCLOUD_RUNTIME_CONFIG_PATH: process.env.HITECHCLOUD_RUNTIME_CONFIG_PATH,
};

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  for (const key of ["HB_SANDBOX_ROOT", "HITECHCLOUD_RUNTIME_CONFIG_PATH"] as const) {
    if (ORIGINAL_ENV[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = ORIGINAL_ENV[key];
    }
  }
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function writeRuntimeConfig(root: string, document: Record<string, unknown>): void {
  const configPath = path.join(root, "state", "runtime-config.json");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
  process.env.HB_SANDBOX_ROOT = root;
  process.env.HITECHCLOUD_RUNTIME_CONFIG_PATH = configPath;
}

test("seedance-2.0 is the default proxy video model", () => {
  assert.equal(
    defaultVideoGenerationModelForProvider("hitechcloud_model_proxy"),
    "bytedance/seedance-2.0",
  );
  assert.equal(defaultVideoGenerationModelForProvider("hitechcloud"), "bytedance/seedance-2.0");
  // Unknown / unsupported providers have no default.
  assert.equal(defaultVideoGenerationModelForProvider("anthropic"), null);
});

test("configured runtime.video_generation resolves the proxy model", () => {
  const root = makeTempDir("hb-video-model-configured-");
  writeRuntimeConfig(root, {
    runtime: {
      video_generation: { provider: "hitechcloud_model_proxy", model: "alibaba/happyhorse-1.1" },
    },
    providers: { hitechcloud_model_proxy: { base_url: "https://proxy.example/v1" } },
  });
  const selection = resolveVideoGenerationModelSelection({});
  assert.equal(selection.providerId, "hitechcloud_model_proxy");
  assert.equal(selection.modelId, "alibaba/happyhorse-1.1");
  assert.equal(selection.source, "configured");
});

test("configured provider without a model falls back to the proxy default", () => {
  const root = makeTempDir("hb-video-model-default-");
  writeRuntimeConfig(root, {
    runtime: { video_generation: { provider: "hitechcloud_model_proxy" } },
    providers: { hitechcloud_model_proxy: { base_url: "https://proxy.example/v1" } },
  });
  const selection = resolveVideoGenerationModelSelection({});
  assert.equal(selection.modelId, "bytedance/seedance-2.0");
  assert.equal(selection.source, "default");
});

test("an unavailable video provider is reported disabled", () => {
  const root = makeTempDir("hb-video-model-disabled-");
  writeRuntimeConfig(root, {
    runtime: { video_generation: { provider: "openai_direct", model: "sora-2" } },
    providers: {},
  });
  const selection = resolveVideoGenerationModelSelection({});
  assert.equal(selection.source, "disabled");
  assert.equal(selection.modelId, null);
});
