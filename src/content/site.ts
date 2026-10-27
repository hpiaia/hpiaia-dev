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
    'Senior full stack engineer in Brazil with 12+ years building web products end to end: TypeScript, React, Node.js, Go and AWS. Work history, resume and contact.',
  user: 'hpiaia',
  version: '4.10',
  host: 'dev',
  // hpiaia97 counts its uptime and copyright from this year
  born: 1997,
  avatar: '/avatar.jpg',
  // From LinkedIn; the year count is computed so it never goes stale
  bio: [
    'I am a full stack engineer with advanced expertise in TypeScript, PHP, C# and DevOps.',
    "But let's rewind a bit, shall we?",
    `My journey began in 2010, as a curious teenager experimenting with creating games and servers. To my surprise, things went surprisingly well and in 2012 I launched my first game server (written in C), which quickly attracted over a hundred active players. Over the next couple of years, I realized this wasn't just a hobby. This was my passion and I could do that for the rest of my life. Indeed, that's what I have been doing for the past ${new Date().getFullYear() - 2012} years.`,
    "Over all those years, I've transitioned from designing website layouts to developing robust web applications using TypeScript and C#, aiding businesses in expanding their customer base and revenue.",
    "My expertise also extends to DevOps; I've architected and maintained clusters hosting over 100 dockerized microservices with Kubernetes, Docker and Terraform.",
    'Now, I specialize in optimizing software performance using advanced technologies like TypeScript, Go, and Rust.',
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
    { label: 'linkedin', href: 'https://linkedin.com/in/hpiaia' },
    { label: 'soundcloud', href: 'https://soundcloud.com/sprnv4' },
    { label: 'email', href: 'mailto:betopiaia@gmail.com' },
  ] satisfies LinkRef[],
}
