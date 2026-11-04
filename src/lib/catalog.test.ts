import { describe, expect, it } from "vitest";
import type { AnimeWithEps } from "./anime";
import { featuredCatalog, filterCatalog } from "./catalog";

const anime: AnimeWithEps[] = [
  { id: "one", title: "One", description: "", genres: ["Action"], status: "ongoing", published: true, featured: true, thumbnail_url: null, banner_url: null, release_year: null, created_at: "", updated_at: "", episodes: [{ audio_language: "english", version: "dub", published: true }, { audio_language: "hindi", version: "dub", published: false }] },
  { id: "two", title: "Two", description: "", genres: ["Drama"], status: "completed", published: false, featured: true, thumbnail_url: null, banner_url: null, release_year: null, created_at: "", updated_at: "", episodes: [{ audio_language: "telugu", version: "dub", published: true }] },
];
const empty = { q: "", genre: "", lang: "", status: "" };

describe("catalog rules", () => {
  it("never advertises an unpublished Hindi episode", () => {
    expect(filterCatalog(anime, { ...empty, lang: "hindi" })).toEqual([]);
  });
  it("filters English by actual published episodes", () => {
    expect(filterCatalog(anime, { ...empty, lang: "english" }).map((a) => a.id)).toEqual(["one"]);
  });
  it("filters Telugu by actual published episodes", () => {
    expect(filterCatalog(anime, { ...empty, lang: "telugu" }).map((a) => a.id)).toEqual(["two"]);
  });
  it("combines search, genre and status without modifying the catalog", () => {
    expect(filterCatalog(anime, { ...empty, q: " one ", genre: "Action", status: "ongoing" }).map((a) => a.id)).toEqual(["one"]);
    expect(filterCatalog(anime, empty)).toHaveLength(2);
  });
  it("only features published entries", () => {
    expect(featuredCatalog(anime).map((a) => a.id)).toEqual(["one"]);
  });
});
import { categoryCatalog } from "./catalog";
describe("categoryCatalog", () => {
  const mk = (id: string, genres: string[], featured = false) => ({ id, genres, featured, published: true, episodes: [] }) as never;
  const list = [mk("a", ["Action"], true), mk("m", ["Movie"]), mk("c", ["Cricket"])];
  it("movie tab shows Movie-tagged titles", () => expect(categoryCatalog(list, "movie").map((a: { id: string }) => a.id)).toEqual(["m"]));
  it("anime tab excludes movies and sport", () => expect(categoryCatalog(list, "anime").map((a: { id: string }) => a.id)).toEqual(["a"]));
  it("trending shows featured", () => expect(categoryCatalog(list, "trending").map((a: { id: string }) => a.id)).toEqual(["a"]));
});
