// @vitest-environment node
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { generateSW } from "workbox-build";

it("generates a network-only worker without caching pages or videos", async () => {
  const directory = await mkdtemp(join(tmpdir(), "goku-worker-test-"));
  try {
    const { count } = await generateSW({
      globDirectory: directory,
      globPatterns: [],
      swDest: join(directory, "sw.js"),
      mode: "development",
      navigateFallback: null,
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: ({ url, sameOrigin }) => sameOrigin && !url.pathname.startsWith("/~oauth"),
        handler: "NetworkOnly",
        method: "GET",
      }],
    });
    const worker = await readFile(join(directory, "sw.js"), "utf8");
    expect(count).toBe(0);
    expect(worker).toContain("NetworkOnly");
    expect(worker).not.toContain("precacheAndRoute");
    expect(worker).not.toContain("CacheFirst");
    expect(worker).not.toContain("NetworkFirst");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});