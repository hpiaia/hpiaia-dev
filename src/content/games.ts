// Icons are the games' own executable icons (sources in the README)
export const games = [
  { slug: 'with-your-destiny', title: 'With Your Destiny' },
  { slug: 'world-of-warcraft', title: 'World of Warcraft' },
  { slug: 'grand-chase', title: 'Grand Chase' },
  { slug: 'last-chaos', title: 'Last Chaos' },
  { slug: 'mu-online', title: 'MU Online' },
  { slug: 'metin-2', title: 'Metin 2' },
  { slug: 'need-for-speed-underground-2', title: 'Need for Speed Underground 2', label: 'NFSU2' },
  { slug: 'blood', title: 'Blood' },
].map((game: { slug: string; title: string; label?: string }) => ({
  ...game,
  label: game.label ?? game.title,
  icon: `/games/${game.slug}.png`,
}))

export type Game = (typeof games)[number]
