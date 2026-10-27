// `icon`: the game's icon (sources in the README); games without one show their box art
export const games = [
  { slug: 'with-your-destiny', title: 'With Your Destiny', icon: true },
  { slug: 'world-of-warcraft', title: 'World of Warcraft', icon: true },
  { slug: 'grand-chase', title: 'Grand Chase', icon: true },
  { slug: 'last-chaos', title: 'Last Chaos', icon: true },
  { slug: 'mu-online', title: 'MU Online', icon: true },
  { slug: 'metin-2', title: 'Metin 2', icon: true },
  {
    slug: 'need-for-speed-underground-2',
    title: 'Need for Speed Underground 2',
    label: 'NFSU2',
    icon: true,
  },
  { slug: 'blood', title: 'Blood', icon: true },
].map((game: { slug: string; title: string; label?: string; icon?: boolean }) => ({
  ...game,
  label: game.label ?? game.title,
  cover: `/games/${game.slug}.png`,
  icon: game.icon ? `/games/icons/${game.slug}.png` : undefined,
}))

export type Game = (typeof games)[number]
