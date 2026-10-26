# hpiaia.dev

Personal site of Humberto Piaia: a late-90s style desktop in the browser, "hpiaia97", that can also run on the CRT
monitor of a retro gaming desk in a 3D bedroom scene.

## How it works

- `/` renders the desktop: icons, a taskbar with a Start menu, and windows you can drag, resize, minimize and
  maximize. The beveled look is a handful of Tailwind utilities (`bevel`, `bevel-in`, ...) in `src/app/app.css`. Apps are
  listed in `src/lib/apps.ts` and live in `src/components/desktop/apps/`. Window state is a small store in
  `src/lib/windows.ts`.
- The focused window is mirrored in the URL (`/work/smartrr`, `/terminal`, ...), and every app path is prerendered,
  so links open straight into a window. `/resume` still serves the pdf; the resume window lives at `/cv`.
- ⌘K (or Start > Find) searches apps, jobs and links; F1 opens Help. The color scheme (Standard or Night), wallpaper,
  command prompt colors and sounds are in Display Properties and persist in localStorage.
- The **3D desk** button swaps the page for a react-three-fiber scene: a retro desk model, a wall of posters, three.js
  lights and shadows. The same desktop is projected onto the monitor with drei `Html`, scaled up so it stays legible,
  under a lighter set of CRT layers. Window drags are mapped through a homography so they follow the cursor despite
  the perspective transform (`src/lib/pointer.ts`). The scene is only loaded when you switch to it.
- The Terminal app is a DOS-style command prompt on xterm.js, browsing a small C: drive (`src/lib/fs.ts`). Commands
  are plain functions in `src/lib/shell.ts` that return ANSI strings and an optional action. DOS commands (`dir`,
  `type`, `cd..`, `cls`, `start`, `color 0A`, `ver`, `tree`) sit on top of the unix ones (`ls`, `cat`, `cd`, `clear`,
  `open`, `pwd`), and both work on the same files. `help` lists them; `start <app>` opens desktop windows and `exit`
  closes the prompt. Key presses play Holy Panda switch samples through Web Audio.
- On the 3D monitor, the four left buttons switch the prompt colors between gray, green, blue and amber, and the
  power button turns the screen off to reveal reflective glass and the bedroom panorama.
- Game packaging uses custom artwork with a faded-print finish tuned in `src/lib/print.ts`.

## Develop

```bash
pnpm install
pnpm dev
```

Content lives in `src/content/site.ts` and `src/content/resume.ts`. Desktop colors are the `--w-*` CSS variables at the top of
`src/app/app.css`. Scene layout, camera and lights are the config at the top of `src/components/Scene.tsx`. Posters
are the list at the top of `src/components/Wall.tsx`.

The 3D model is `public/models/desk.glb`, compressed with meshopt and WebP textures via
`gltf-transform optimize`.
Touch devices load `public/models/desk-mobile.glb` with smaller textures.

The resume is data in `src/content/resume.ts`, rendered to PDF with `@react-pdf/renderer` by the
`/resume.pdf` route at build time.

## Credits

- Window manager idea: [posthog.com](https://posthog.com).
- Desk model: [Retro 98/XP Gaming Desktop Setup](https://sketchfab.com/3d-models/retro-98xp-gaming-desktop-setup-a5bb8e6329ae4719b8c4c7cfacecde3a)
  by [Bacon](https://sketchfab.com/Baconmaster2890), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Environment map: an AI-generated panorama of a 2000s bedroom, used for soft fill light and the
  reflection in the switched-off screen.
- Command prompt font: IBM VGA 8x16 from the [Ultimate Oldschool PC Font Pack](https://int10h.org/oldschool-pc-fonts/)
  by VileR, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) (license in `public/fonts/IBM-VGA-LICENSE.txt`).
- Keyboard sounds: Holy Panda samples from [kbsim](https://github.com/tplai/kbsim) by Thomas Lai,
  MIT, via the [Mechvibes](https://github.com/hainguyents13/mechvibes) sound packs.
- Posters: World of Warcraft art © Blizzard Entertainment, album covers © their labels. Personal,
  non-commercial use.
- Game packaging: artwork and logos belong to their respective game publishers. WoW jewel-case
  fronts reuse Blizzard cover art; backs and the WYD disc label use generated adaptations.
