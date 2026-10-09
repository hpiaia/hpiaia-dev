# hpiaia.dev

Personal site of Humberto Piaia: an xterm.js terminal running on a CRT monitor in a 3D
bedroom scene.

## How it works

- `/` renders a react-three-fiber scene: a retro desk model, a wall of posters, three.js lights
  and shadows. The monitor screen is a DOM plane projected onto the model with drei `Html`.
- The screen is an xterm.js terminal. Commands are plain functions in `src/lib/shell.ts` that
  return ANSI strings and an optional action. `help` lists them.
- Scanlines, grain, sweep, flicker and vignette are CSS layers over the terminal.
- Mouse events are remapped through a homography so links and selection land on the right
  character despite the perspective transform (`src/lib/pointer.ts`).
- Key presses play Holy Panda switch samples through Web Audio. `sound off` mutes them.
- The monitor's four left buttons switch between gray, green, blue and red phosphor themes;
  `theme <name>` does the same. Power and theme buttons play synthesized sounds.
- When powered off, the terminal hides to reveal reflective glass and the bedroom panorama.
- Game packaging uses custom artwork with a faded-print finish tuned in `src/lib/print.ts`.

## Develop

```bash
pnpm install
pnpm dev
```

Content lives in `src/content/site.ts`. Scene layout, camera and lights are the config at the
top of `src/components/Scene.tsx`. Posters are the list at the top of `src/components/Wall.tsx`.

The 3D model is `public/models/desk.glb`, compressed with meshopt and WebP textures via
`gltf-transform optimize`.
Touch devices load `public/models/desk-mobile.glb` with smaller textures.

The resume is data in `src/content/resume.ts`, rendered to PDF with `@react-pdf/renderer` by the
`/resume.pdf` route at build time.

## Credits

- Desk model: [Retro 98/XP Gaming Desktop Setup](https://sketchfab.com/3d-models/retro-98xp-gaming-desktop-setup-a5bb8e6329ae4719b8c4c7cfacecde3a)
  by [Bacon](https://sketchfab.com/Baconmaster2890), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Environment map: an AI-generated panorama of a 2000s bedroom, used for soft fill light and the
  reflection in the switched-off screen.
- Keyboard sounds: Holy Panda samples from [kbsim](https://github.com/tplai/kbsim) by Thomas Lai,
  MIT, via the [Mechvibes](https://github.com/hainguyents13/mechvibes) sound packs.
- Posters: World of Warcraft art © Blizzard Entertainment, album covers © their labels. Personal,
  non-commercial use.
- Game packaging: artwork and logos belong to their respective game publishers. WoW jewel-case
  fronts reuse Blizzard cover art; backs and the WYD disc label use generated adaptations.
