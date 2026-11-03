import { describe, expect, it } from "vitest";
import { canOfferInstall, INSTALL_COOLDOWN_MS, isPreviewHostname } from "./pwa";

describe("installation eligibility", () => {
  it("never offers installation to an installed user", () => {
    expect(canOfferInstall(true, null, Date.now())).toBe(false);
  });
  it("offers a first-time eligible visitor installation", () => {
    expect(canOfferInstall(false, null, Date.now())).toBe(true);
  });
  it("suppresses dismissed prompts for fourteen days", () => {
    const dismissed = 1000;
    expect(canOfferInstall(false, String(dismissed), dismissed + INSTALL_COOLDOWN_MS - 1)).toBe(false);
    expect(canOfferInstall(false, String(dismissed), dismissed + INSTALL_COOLDOWN_MS)).toBe(true);
  });
});

describe("preview safety", () => {
  it.each(["localhost", "id-preview--abc.lovable.app", "preview-2--abc.gpt-eng.com", "project--abc-dev.lovable.app", "foo.lovableproject-dev.com", "beta.lovable.dev"])("blocks worker registration on %s", (host) => {
    expect(isPreviewHostname(host)).toBe(true);
  });
  it.each(["goku-streamin.lovable.app", "preview-v2--shop.example.com"])("allows the published origin %s", (host) => {
    expect(isPreviewHostname(host)).toBe(false);
  });
});