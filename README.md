# Back to Us

A personal site for Vyshu, built on top of the January 2025 birthday card (which lives on inside it at `#/birthday`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/back-to-us/
```

## Before she sees it — checklist

1. **Rewrite the drafts.** Items with `draft: true` in `src/content` were written by Claude. Change the words in the Studio (Chapters → Studio) or straight in `src/content/*.js`, then untick "draft". The letter matters most.
2. **Fill the note jar** with things only you know (`Notes` tab in the Studio). Placeholders never ship.
3. **Add photos** — two ways:
   - Put the file in `public/photos/` and type its name in the Studio (best for many or large photos), or
   - Upload in the Studio (gets compressed and saved inside the content file).
4. **Set your WhatsApp number** in `src/config.js` (digits with country code, e.g. `919876543210`).
5. **Export** from the Studio → save as `src/content/overrides.json`.
6. `npm run deploy` (builds and publishes to GitHub Pages at `sravanmothukuri.github.io/back-to-us`, same as the birthday card). Create the `back-to-us` repo first.

## What works where

| Thing | Where it lives | Who sees it |
|---|---|---|
| Story, letter, promises, notes | In the code (`src/content`, `overrides.json`) | Anyone with the link |
| Studio + private reflections | Your browser, dev server only — **never built or deployed** | Only you, on this computer |
| Her check-ins, needs, boundaries, movies, visit plan, favourites | Her phone's browser (localStorage) | Only her, until she taps "Sravan ki pampu" |
| "Sravan ki pampu" | Opens WhatsApp with the text filled in | You, only if she sends it |

Honest limits:
- Nothing syncs. Her answers on her phone don't appear on yours; that's what the WhatsApp button is for.
- Clearing browser data or using incognito loses local data. She has Backup / Restore / Delete-all in "Nee turn".
- The deployed site has no password. Anyone with the link can read the story and letter — keep the link between you two. `noindex` is set so search engines skip it.
- Nothing is encrypted.
- Sensitive things (the college-brother situation, family details) are deliberately **not** in the site. Keep it that way unless she says otherwise.

A real login + shared data would need a backend (e.g. Firebase/Supabase with auth and per-person access rules) — not built.

## Structure

```
src/
  content/      story.js, letter.js, notes.js, promises.js, play.js, overrides.json
  pages/        Home (opening ritual), Story, Letter, Promises, Jar, Play, You, Next
  components/   Polaroid, Chapter (heading + "inka five minutes?"), SendToSravan, Hearts, Toast
  studio/       dev-only editor + private reflection
  birthday/     the original card, untouched except: scoped CSS, music stops on exit,
                tap works like Enter on phones, exit button
public/photos/  the 13 monthly photos + vyshusravan.jpg
```
