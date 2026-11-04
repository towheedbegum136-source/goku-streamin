import { describe, expect, it } from "vitest";
import { isDownloadable } from "./downloads";

describe("isDownloadable", () => {
  it("allows direct video files", () => expect(isDownloadable("https://cdn.example.com/ep1.mp4")).toBe(true));
  it("refuses embedded players", () => expect(isDownloadable("https://youtu.be/abcdefg")).toBe(false));
  it("refuses empty links", () => expect(isDownloadable("")).toBe(false));
});
