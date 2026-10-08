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
  since: 2013,
  avatar: '/avatar.jpg',
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
      what: 'key sounds',
      title: 'Holy Panda samples from kbsim',
      url: 'https://github.com/tplai/kbsim',
      by: 'Thomas Lai',
      byUrl: 'https://github.com/tplai',
      license: 'MIT',
      licenseUrl: 'https://github.com/tplai/kbsim/blob/master/LICENSE',
    },
  ] satisfies Credit[],
  posters: 'world of warcraft art © blizzard · album covers © their labels',
  stack: ['next', 'react', 'three.js', 'react-three-fiber', 'xterm.js', 'tailwind'],
  about: [
    'full stack engineer since 2013, brazil',
    'typescript · go · rust',
    'now at constellation network',
    'into ai agents, infra, music',
  ],
  skills: [
    'typescript · node · react · next',
    'go · rust',
    'aws · terraform · kubernetes · docker',
    'postgres · redis · kafka',
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
