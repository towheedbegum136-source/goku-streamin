import { describe, expect, it } from "vitest";
import { parseVideoUrl } from "./video";

describe("parseVideoUrl", () => {
  it("embeds YouTube watch links", () => {
    expect(parseVideoUrl("https://www.youtube.com/watch?v=abcDEF12345")).toEqual({
      kind: "iframe",
      provider: "YouTube",
      src: "https://www.youtube-nocookie.com/embed/abcDEF12345",
    });
  });
  it("embeds youtu.be short links", () => {
    expect(parseVideoUrl("https://youtu.be/abcDEF12345").kind).toBe("iframe");
  });
  it("embeds Google Drive share links as preview", () => {
    const r = parseVideoUrl("https://drive.google.com/file/d/1AbC_xyz/view?usp=sharing");
    expect(r).toMatchObject({ kind: "iframe", src: "https://drive.google.com/file/d/1AbC_xyz/preview" });
  });
  it("plays direct mp4 files", () => {
    expect(parseVideoUrl("https://cdn.example.com/ep1.mp4").kind).toBe("file");
  });
  it("rejects arbitrary webpages", () => {
    expect(parseVideoUrl("https://example.com/some-page").kind).toBe("unsupported");
  });
  it("rejects javascript: links", () => {
    expect(parseVideoUrl("javascript:alert(1)").kind).toBe("unsupported");
  });
});
