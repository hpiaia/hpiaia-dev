export type LinkRef = { label: string; href: string }
// Every part is optional: a credit can be a link, an author, a license, a note or any mix of them
export type Credit = {
  what: string
  title?: string
  url?: string
  by?: string
  byUrl?: string
  license?: string
  licenseUrl?: string
  note?: string
}

export const site = {
  name: 'Humberto Piaia',
  title: 'Humberto Piaia - Senior Full Stack Engineer',
  description:
    'Humberto Piaia is a senior full stack engineer in Brazil with 12+ years shipping TypeScript, React, Node.js, Go and AWS products for remote US teams.',
  // Bump when the resume or the site copy changes: it feeds the sitemap's lastmod and the schema's dateModified
  updated: '2026-10-28',
  user: 'hpiaia',
  version: '4.10',
  host: 'dev',
  // hpiaia97 counts its uptime and copyright from this year
  born: 1997,
  avatar: '/avatar.jpg',
  // The opening line names me and the role, so it reads as a summary when quoted out of context
  bio: [
    "I'm Humberto Piaia, a senior full stack engineer in Santa Catarina, Brazil. Since 2021 I've worked remotely with US teams, writing the product code and running the infrastructure under it.",
    "But let's rewind a bit, shall we?",
    'My journey began in 2010, as a curious teenager experimenting with creating games and servers. To my surprise, things went well and in 2012 I launched my first game server (a With Your Destiny server, written in C), which quickly attracted over a hundred active players. It ran on the PC in my bedroom, then on a Windows VPS I rented, and it crashed a lot, mostly because I was learning to write code while a hundred people were playing on it. Real people, on something I built, that I had to keep up. I never got over that.',
    "That's still what I do. The stacks changed, from website layouts to web apps, APIs, clusters and infrastructure, but the job is the same: build the thing, then be the one who keeps it running.",
  ],
  credits: [
    { what: 'window manager idea', title: 'posthog.com', url: 'https://posthog.com' },
    {
      what: '3D model',
      title: 'Retro 98/XP Gaming Desktop Setup',
      url: 'https://sketchfab.com/3d-models/retro-98xp-gaming-desktop-setup-a5bb8e6329ae4719b8c4c7cfacecde3a',
      by: 'Bacon',
      byUrl: 'https://sketchfab.com/Baconmaster2890',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    },
    {
      what: 'prompt font',
      title: 'IBM VGA 8x16, Ultimate Oldschool PC Font Pack',
      url: 'https://int10h.org/oldschool-pc-fonts/',
      by: 'VileR',
      byUrl: 'https://int10h.org/',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    {
      what: 'key sounds',
      title: 'Holy Panda samples from kbsim',
      url: 'https://github.com/tplai/kbsim',
      by: 'Thomas Lai',
      byUrl: 'https://github.com/tplai',
      license: 'MIT',
      licenseUrl: 'https://github.com/tplai/kbsim/blob/master/LICENSE.md',
    },
    {
      what: 'winamp',
      title: 'Webamp',
      url: 'https://github.com/captbaritone/webamp',
      by: 'Jordan Eldredge',
      byUrl: 'https://github.com/captbaritone',
      license: 'MIT',
      licenseUrl: 'https://github.com/captbaritone/webamp/blob/master/LICENSE.txt',
      note: 'songs play from their YouTube uploads, © the artists and their labels',
    },
    {
      what: 'games',
      title: 'SteamGridDB',
      url: 'https://www.steamgriddb.com',
      note: 'box art and icons © their publishers',
    },
    {
      what: 'wallpapers',
      title: 'Windows Wallpaper Wiki',
      url: 'https://windowswallpaper.miraheze.org/wiki/Windows_98',
      note: 'the Windows 98 originals, © Microsoft',
    },
    { what: 'posters', note: 'World of Warcraft art © Blizzard, album covers © their labels' },
  ] satisfies Credit[],
  source: 'https://github.com/hpiaia/hpiaia-dev',
  stack: ['Next.js', 'React', 'three.js', 'xterm.js', 'Tailwind', 'zustand', 'Radix', 'cmdk'],
  now: [
    'working: senior full stack engineer at constellation network',
    'into: ai agents, infra, music production',
    'based: santa catarina, brazil · utc-3',
  ],
  links: [
    { label: 'resume', href: '/resume.pdf' },
    { label: 'github', href: 'https://github.com/hpiaia' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/hpiaia' },
    { label: 'x', href: 'https://x.com/hpiaiadev' },
    { label: 'soundcloud', href: 'https://soundcloud.com/sprnv4' },
    { label: 'email', href: 'mailto:betopiaia@gmail.com' },
  ] satisfies LinkRef[],
}
