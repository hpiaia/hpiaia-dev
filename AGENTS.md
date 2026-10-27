# AGENTS.md

hpiaia.dev is a personal site built as a late-90s desktop ("hpiaia97") that can also be shown on a 3D desk. It is a
fully static Next.js App Router project. The README covers what the site does and where content lives; this file
covers how to work on it.

## Commands

```bash
pnpm dev                  # dev server
pnpm build                # production build; must pass before you hand work back
pnpm lint                 # eslint (next core-web-vitals + typescript)
pnpm exec tsc --noEmit    # type-check
pnpm format               # prettier --write .
pnpm dlx knip             # unused files, exports and dependencies; keep it clean
```

There is no test suite. Verify with type-check, lint and build. For UI changes, run the app and check the change on
the plain screen and in the 3D desk view.

## Code style

- Prettier: 120 columns, no semicolons, single quotes. Run `pnpm format` on files you touch.
- Import with the `@/` alias (`@/lib/apps`, `@/components/desktop/...`), never long relative paths.
- Small modules, named exports, plain functions. Don't export what only the file itself uses.
- Comments are rare and explain _why_ (a constraint, a browser quirk, a deliberate trade-off), never what the next
  line does. Match the density of the surrounding code.
- Tailwind 4 utilities inline. Shared 98-style looks (`bevel`, `bevel-in`, `scroll-98`, colors as `--w-*`) live in
  `src/app/app.css`; reuse them instead of new one-off styles.
- Reuse the controls in `src/components/desktop/apps/shared.tsx` (`Button`, `Sunken`, `GroupBox`, `Tabs`,
  `StatusBar`, ...) when building app UI.
- Content (text, jobs, albums, games, links) lives in `src/content/`, not in components.

## Architecture rules

- **Everything is prerendered.** `src/app/[[...page]]/page.tsx` has `dynamicParams = false` and generates params from
  `apps`, `resume.jobs` and `albums`. Don't add server-only runtime behavior (cookies, headers, dynamic data).
- **The desktop must work inside the 3D monitor.** There it is rendered in drei `Html` under a CSS transform, and
  pointer events are remapped by a homography (`src/lib/pointer.ts`). So:
  - Don't portal UI to `document.body` (menus, dialogs, popovers stay inside the desktop tree).
  - Use the desktop's container queries (`@container/desk`, e.g. `@max-[639px]/desk:`) for compact layouts, not
    viewport media queries.
  - Measure with the desktop's bounds (`useWindows().bounds`), not `window.innerWidth`.
- **State** is zustand: `src/lib/windows.ts` (open windows; not persisted), `src/lib/settings.ts` (persisted to
  localStorage), `src/lib/dialogs.ts` (message boxes). Saved settings are validated against an `allowed` list, so a
  new setting needs a default and its allowed values. If it must apply before first paint, also update
  `settingsScript` in `src/lib/settings-script.ts`.
- **Heavy code loads on demand.** The 3D scene (`next/dynamic`, `ssr: false`), the Terminal and Webamp are lazy.
  Keep three.js, xterm and webamp out of the initial bundle.
- **Sounds** go through `src/lib/power.ts` / `src/lib/keys.ts` and respect the `sound` setting.

### Adding an app

1. Add the key to `AppKey` and an entry to `apps` in `src/lib/apps.ts` (title, label, size, desktop side).
2. Create `src/components/desktop/apps/<Name>.tsx` and render it in `AppView` in `apps/index.tsx`.
3. Add an icon to `appIcons` in `src/components/desktop/icons.tsx`, and a title and description in
   `src/lib/seo.ts`. Add it to `unindexed` if the page has no content worth indexing. The type-checker flags any
   `Record<AppKey, ...>` you miss.
4. The route, desktop icon and sitemap entry follow from `apps`. The Start menu's Programs list is hardcoded in
   `src/components/desktop/Taskbar.tsx`; add the key there if it belongs in it.

### Content and assets

- `src/content/resume.ts` feeds the desktop, the PDF (`src/pdf/Resume.tsx`), `llms.txt` and the JSON-LD. Inline
  markdown (`**bold**`, `[link](url)`) is parsed by `src/lib/markdown.ts`.
- Bump `site.updated` in `src/content/site.ts` when content changes.
- Third-party assets need a credit in **both** `site.credits` (shown in the Help app) and the README's Credits.
- Files in `public/` are cached for a day with a week of stale-while-revalidate and keep their names. Prefer a new
  filename over replacing an asset in place. 3D models are compressed with `gltf-transform optimize`.

## Git

- Conventional commits with a scope: `feat(desktop): ...`, `fix(seo): ...`, `chore: ...`.
- Work on a branch and open a PR to `main`. Commit only when asked.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
