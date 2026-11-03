<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Admin authorization is enforced by RLS using `public.has_role(auth.uid(),'admin')`; UI gates are cosmetic. Why: admin must be secure server-side.
- Episode audio language/version live on episodes; anime "available versions" are derived from published episodes. Why: never advertise dubs that don't exist.
- Video links go through `src/lib/video.ts` parseVideoUrl; extend it to support new providers. Why: one place decides what can embed.
- Home-page showcase video uses CDN asset pointers and a stable native background video element, without episode records or interaction-driven remounts. Why: showcase footage stays separate from the catalog and plays continuously during homepage interactions.
- Anime posters, wallpapers, and admin thumbnails use the shared AnimeImage component with a non-logo artwork fallback. Why: every image display recovers from missing or failed sources without changing catalog records.
- Catalog filtering and featured selection use src/lib/catalog.ts; language availability requires published episodes. Why: merged browsing features share tested rules without changing records.
- EpisodeVideo handles episode playback recovery, keyed by episode ID and URL; never use it for the home background. Why: retry state resets between episodes without restarting the showcase video.
- PWA registration lives in src/lib/pwa.ts with development/iframe/preview and sw=off guards; generateSW performs no page, API, or media caching. Why: installability must not retain private data, stale pages, or streaming videos.
- InstallPrompt mounts once outside the shared page outlet and uses native installation eligibility with persistent dismissal cooldown. Why: navigation must preserve playback and never fabricate an install dialog.
