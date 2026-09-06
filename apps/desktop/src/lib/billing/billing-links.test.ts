import test from "node:test";
import assert from "node:assert/strict";

import {
  HITECHCLOUD_HOME_URL,
  buildDesktopBillingLinks,
  deriveAppBaseUrl,
  normalizeBaseUrl,
} from "./billing-links.js";

test("deriveAppBaseUrl", async (t) => {
  await t.test(
    "given the hitechcloud.vn prod API host, derives the www.hitechcloud.vn web host",
    () => {
      assert.equal(
        deriveAppBaseUrl("https://api.hitechcloud.vn"),
        "https://www.hitechcloud.vn",
      );
    },
  );

  await t.test(
    "given the hitechcloud.vn API host with a trailing path, still derives www.hitechcloud.vn (path is dropped, origin only)",
    () => {
      assert.equal(
        deriveAppBaseUrl("https://api.hitechcloud.vn/api/v1"),
        "https://www.hitechcloud.vn",
      );
    },
  );

  await t.test(
    "given the hitechcloud.vn legacy prod API host, derives app.hitechcloud.vn",
    () => {
      assert.equal(
        deriveAppBaseUrl("https://api.hitechcloud.vn"),
        "https://app.hitechcloud.vn",
      );
    },
  );

  await t.test(
    "given the imerchstaging staging API host, derives app.imerchstaging.com",
    () => {
      assert.equal(
        deriveAppBaseUrl("https://api.imerchstaging.com"),
        "https://app.imerchstaging.com",
      );
    },
  );

  await t.test(
    "given the imerchstaging preview API host, derives preview.imerchstaging.com",
    () => {
      assert.equal(
        deriveAppBaseUrl("https://api-preview.imerchstaging.com"),
        "https://preview.imerchstaging.com",
      );
    },
  );

  await t.test(
    "given the local dev API host on port 4000, derives the web dev origin on port 4321",
    () => {
      assert.equal(
        deriveAppBaseUrl("http://localhost:4000"),
        "http://localhost:4321",
      );
    },
  );

  await t.test(
    "given localhost on a non-dev port, returns the same origin unchanged",
    () => {
      assert.equal(
        deriveAppBaseUrl("http://localhost:5173"),
        "http://localhost:5173",
      );
    },
  );

  await t.test(
    "given a host that doesn't match any known pattern, returns the origin unchanged",
    () => {
      assert.equal(
        deriveAppBaseUrl("https://example.com"),
        "https://example.com",
      );
    },
  );

  await t.test(
    "given an empty string, falls back to the hitechcloud.vn home URL (the canonical default)",
    () => {
      assert.equal(deriveAppBaseUrl(""), HITECHCLOUD_HOME_URL);
      assert.equal(HITECHCLOUD_HOME_URL, "https://www.hitechcloud.vn");
    },
  );

  await t.test(
    "given a malformed URL, falls back to the hitechcloud.vn home URL",
    () => {
      assert.equal(deriveAppBaseUrl("not a url"), HITECHCLOUD_HOME_URL);
    },
  );
});

test("buildDesktopBillingLinks", async (t) => {
  await t.test(
    "given the www.hitechcloud.vn web base, builds all four billing links rooted there",
    () => {
      const links = buildDesktopBillingLinks("https://www.hitechcloud.vn");
      assert.deepEqual(links, {
        billingPageUrl: "https://www.hitechcloud.vn/app/settings?tab=billing",
        addCreditsUrl:
          "https://www.hitechcloud.vn/app/settings?tab=billing&intent=add-credits",
        upgradeUrl:
          "https://www.hitechcloud.vn/app/settings?tab=billing&intent=upgrade",
        usageUrl: "https://www.hitechcloud.vn/app/settings?tab=billing&intent=usage",
      });
    },
  );

  await t.test(
    "given a base URL with a trailing slash, normalizes it before composing the links",
    () => {
      const links = buildDesktopBillingLinks("https://app.imerchstaging.com/");
      assert.equal(
        links.billingPageUrl,
        "https://app.imerchstaging.com/app/settings?tab=billing",
      );
    },
  );

  await t.test(
    "given an empty base URL, falls back to the hitechcloud.vn home URL so the user still lands on the live web app",
    () => {
      const links = buildDesktopBillingLinks("");
      assert.equal(
        links.billingPageUrl,
        "https://www.hitechcloud.vn/app/settings?tab=billing",
      );
      assert.equal(
        links.billingPageUrl,
        `${HITECHCLOUD_HOME_URL}/app/settings?tab=billing`,
      );
    },
  );
});

test("deriveAppBaseUrl piped into buildDesktopBillingLinks (the production code path)", async (t) => {
  await t.test(
    "given api.hitechcloud.vn, the Manage button URL lands on www.hitechcloud.vn (regression test for the app./www. mixup)",
    () => {
      const appBase = deriveAppBaseUrl("https://api.hitechcloud.vn");
      const links = buildDesktopBillingLinks(appBase);
      assert.equal(
        links.billingPageUrl,
        "https://www.hitechcloud.vn/app/settings?tab=billing",
      );
      assert.equal(
        links.addCreditsUrl,
        "https://www.hitechcloud.vn/app/settings?tab=billing&intent=add-credits",
      );
    },
  );

  await t.test(
    "given api.imerchstaging.com, the Manage button URL lands on app.imerchstaging.com (staging is unchanged)",
    () => {
      const appBase = deriveAppBaseUrl("https://api.imerchstaging.com");
      const links = buildDesktopBillingLinks(appBase);
      assert.equal(
        links.billingPageUrl,
        "https://app.imerchstaging.com/app/settings?tab=billing",
      );
    },
  );

  await t.test(
    "given api-preview.imerchstaging.com, the Manage button URL lands on preview.imerchstaging.com",
    () => {
      const appBase = deriveAppBaseUrl(
        "https://api-preview.imerchstaging.com",
      );
      const links = buildDesktopBillingLinks(appBase);
      assert.equal(
        links.billingPageUrl,
        "https://preview.imerchstaging.com/app/settings?tab=billing",
      );
    },
  );
});

test("normalizeBaseUrl", async (t) => {
  await t.test("strips a single trailing slash", () => {
    assert.equal(normalizeBaseUrl("https://www.hitechcloud.vn/"), "https://www.hitechcloud.vn");
  });

  await t.test("strips multiple trailing slashes", () => {
    assert.equal(
      normalizeBaseUrl("https://www.hitechcloud.vn///"),
      "https://www.hitechcloud.vn",
    );
  });

  await t.test("returns an empty string for null or undefined input", () => {
    assert.equal(normalizeBaseUrl(null), "");
    assert.equal(normalizeBaseUrl(undefined), "");
  });
});
