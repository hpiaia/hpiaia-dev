# hpiaia.dev

My personal website, live at [hpiaia.dev](https://www.hpiaia.dev): a late-90s desktop in the browser. It can also
run on the CRT monitor of a retro gaming desk in a 3D bedroom.

Built with Next.js (App Router, fully static), React 19, Tailwind 4, zustand, three.js through react-three-fiber,
xterm.js, Webamp and `@react-pdf/renderer`.

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build; every page is prerendered
pnpm lint     # eslint
pnpm format   # prettier
```

### Amp orbs

`.agents/setup` uses the orb's preinstalled Node.js, ensures pnpm matches `package.json`, and installs dependencies
with `pnpm install --frozen-lockfile`. Amp snapshots the prepared environment for new orbs; rerunning setup reuses
the installed dependencies and pnpm cache. No secrets, backing services, or resume hook are required.

## What's in it

- **Desktop.** Icons, a taskbar with a Start menu, and windows you can drag, resize, minimize and maximize. ⌘K (or
  Start > Find) searches apps, jobs, albums, games and links, and F1 opens Help.
- **Apps.** About (WordPad), Work (Explorer), Resume, Command Prompt, Skills, Say Hi, Media Player (SoundCloud),
  Winamp, Help and Display Properties.
- **Command Prompt.** A DOS-style shell on xterm.js that browses a small C: drive. DOS commands (`dir`, `type`, `cd..`,
  `cls`, `start`, `tree`, `ver`) and their unix counterparts (`ls`, `cat`, `cd`, `clear`, `open`, `pwd`) work on
  the same files. `help` lists everything.
- **Winamp.** [Webamp](https://github.com/captbaritone/webamp) drawn onto the desktop. It plays the albums on the
  bedroom wall through a hidden YouTube player that stands in for Webamp's audio engine.
- **3D desk.** The 3D button swaps the page for a react-three-fiber scene with a retro desk model, a wall of posters,
  lights and shadows. The same live desktop is projected onto the monitor. The buttons under the monitor tint it
  green, blue or amber like a phosphor screen, and the power button turns it off to show the reflective glass. The
  scene is only loaded when you switch to it.
- **Details.** Key presses play Holy Panda switch samples. The games on the right ask for a CD that isn't in drive
  D:. Display Properties has 9 Windows 98 wallpapers, a Night scheme and 13 retro fonts.
- **Resume PDF.** `/resume.pdf` is generated at build time from the same data as the resume window. `/resume`
  redirects to it.

### Routing and state

There is one catch-all page, `src/app/[[...page]]/page.tsx`, prerendered for `/`, every app (`/work`, `/terminal`,
...), every job (`/work/<slug>`) and every album (`/winamp/<slug>`). The home page opens About, the Command Prompt
and Winamp. Any other path opens just that app. Each path has its own title, description, canonical URL and JSON-LD
(`src/lib/seo.ts`).

Open windows are not remembered between visits, but settings are. The scheme, wallpaper, font, sound, monitor tint
and screen or desk view persist in localStorage (`src/lib/settings.ts`). An inline script applies the scheme
and wallpaper before first paint.

### Project layout

```
src/
  app/                    routes: the catch-all page, resume.pdf, llms.txt, robots, sitemap, OG image
  components/
    Computer.tsx          switches between the plain screen and the 3D desk
    desktop/              Desktop, Window, Taskbar, Search, MessageBox, icons
      apps/               one component per app, plus shared 98-style controls (shared.tsx)
    3d/                   Scene (camera, lights, model, monitor buttons), Wall (posters), CRT overlay
  content/                site.ts, resume.ts, albums.ts, games.ts: all the text and data
  lib/                    stores (windows, settings, dialogs), shell and filesystem, SEO, audio, 3D helpers
  pdf/Resume.tsx          the resume PDF
public/                   models, posters, wallpapers, fonts, key sounds, game icons
```

## Editing

| To change                          | Edit                                                             |
| ---------------------------------- | ---------------------------------------------------------------- |
| Bio, links, credits, "now"         | `src/content/site.ts`                                            |
| Jobs, skills, education            | `src/content/resume.ts` (feeds the desktop, PDF and `llms.txt`)  |
| Albums and their YouTube tracks    | `src/content/albums.ts`                                          |
| Games on the desktop               | `src/content/games.ts` plus an icon in `public/games/<slug>.png` |
| Apps, window titles and sizes      | `src/lib/apps.ts`                                                |
| Desktop colors and bevels          | `--w-*` variables and utilities in `src/app/app.css`             |
| Shell commands                     | `src/lib/shell.ts`; files on the C: drive are in `src/lib/fs.ts` |
| Camera, lights, screen placement   | the `scene` config at the top of `src/components/3d/Scene.tsx`   |
| Posters on the wall                | the `posters` list in `src/components/3d/Wall.tsx`               |
| Faded print look of game packaging | `src/lib/print.ts`                                               |

The 3D models are `public/models/desk.glb` and `public/models/desk-mobile.glb` (smaller textures, used on touch
devices). Both were compressed with `gltf-transform optimize` (meshopt and WebP textures).

## Credits

- Window manager idea: [posthog.com](https://posthog.com).
- Desk model: [Retro 98/XP Gaming Desktop Setup](https://sketchfab.com/3d-models/retro-98xp-gaming-desktop-setup-a5bb8e6329ae4719b8c4c7cfacecde3a)
  by [Bacon](https://sketchfab.com/Baconmaster2890), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Environment map: an AI-generated panorama of a 2000s bedroom, used for soft fill light and the reflection in the
  switched-off screen.
- Command prompt font: IBM VGA 8x16 from the [Ultimate Oldschool PC Font Pack](https://int10h.org/oldschool-pc-fonts/)
  by VileR, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) (license in
  `public/fonts/IBM-VGA-LICENSE.txt`). The resume PDF uses [Inter](https://github.com/rsms/inter), SIL OFL 1.1
  (`public/fonts/Inter-LICENSE.txt`).
- Game icons: the games' own executable icons, © their publishers, from [SteamGridDB](https://www.steamgriddb.com)
  (World of Warcraft, Grand Chase, Last Chaos, Need for Speed Underground 2, Blood) and the official WYD Global site.
- Wallpapers: the Windows 98 originals, © Microsoft, via the
  [Windows Wallpaper Wiki](https://windowswallpaper.miraheze.org/wiki/Windows_98).
- Winamp: [Webamp](https://github.com/captbaritone/webamp) by Jordan Eldredge, MIT. Songs stream from their YouTube
  uploads, © the artists and their labels.
- Keyboard sounds: Holy Panda samples from [kbsim](https://github.com/tplai/kbsim) by Thomas Lai, MIT, via the
  [Mechvibes](https://github.com/hainguyents13/mechvibes) sound packs.
- Posters: World of Warcraft art © Blizzard Entertainment, album covers © their labels. Personal, non-commercial use.
- Game packaging: artwork and logos belong to their respective game publishers. The WoW jewel-case fronts reuse
  Blizzard cover art; the backs and the WYD disc label use generated adaptations.
