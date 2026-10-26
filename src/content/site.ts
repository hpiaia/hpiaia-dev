export type LinkRef = { label: string; href: string }
export type Credit = {
  what: string
  title: string
  url: string
  by: string
  byUrl: string
  license: string
  licenseUrl: string
}

export const site = {
  name: 'Humberto Piaia',
  title: 'Humberto Piaia - Full Stack engineer',
  description: 'Full stack engineer since 2013, Brazil. TypeScript, Go, Rust.',
  user: 'hpiaia',
  host: 'dev',
  // The year hpiaia97 was first powered on: uptime, build number and copyright count from here
  born: 1997,
  avatar: '/avatar.jpg',
  // From the LinkedIn About section; the year count is computed so it never goes stale
  bio: [
    'I am a full stack engineer with advanced expertise in TypeScript, PHP, C# and DevOps.',
    "But let's rewind a bit, shall we?",
    `My journey began in 2010, as a curious teenager experimenting with creating games and servers. To my surprise, things went surprisingly well and in 2012 I launched my first game server (written in C), which quickly attracted over a hundred active players. Over the next couple of years, I realized this wasn't just a hobby. This was my passion and I could do that for the rest of my life. Indeed, that's what I have been doing for the past ${new Date().getFullYear() - 2012} years.`,
    "Over all those years, I've transitioned from designing website layouts to developing robust web applications using TypeScript and C#, aiding businesses in expanding their customer base and revenue.",
    "My expertise also extends to DevOps; I've architected and maintained clusters hosting over 100 dockerized microservices with Kubernetes, Docker and Terraform.",
    'Now, I specialize in optimizing software performance using advanced technologies like TypeScript, Go, and Rust.',
  ],
  credits: [
    {
      what: '3d model',
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
  ] satisfies Credit[],
  posters: 'world of warcraft art © blizzard · album covers © their labels',
  stack: ['next', 'react', 'three.js', 'xterm.js', 'tailwind'],
  about: [
    'full stack engineer since 2013, brazil',
    'typescript · go · rust · php · c#',
    'now at constellation network',
    'into ai agents, infra, music',
  ],
  skills: [
    ['languages', 'typescript · php · javascript · go · rust · c#'],
    ['frontend', 'react · next · vue · angular · react native'],
    ['backend', 'node · laravel · .net · postgres · redis · mongodb'],
    ['infra', 'aws · terraform · kubernetes · docker'],
    ['ci & tests', 'github actions · circleci · vitest · jest'],
  ],
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
