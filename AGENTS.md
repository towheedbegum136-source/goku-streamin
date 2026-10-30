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
- Home-page uploaded clips use CDN asset pointers and native video controls without creating episode records. Why: showcase media stays separate from the anime catalog.
