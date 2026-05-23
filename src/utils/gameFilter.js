// Filter games by name keywords
export const GAME_ROWS = [
  {
    label: 'Trending',
    keys: ['1day dragon tiger','1 day dragon tiger','naughty','nouty','chicken road','aviator x2','aviator x','lankesh','mini aviator','mini jetx','mini jet x'],
    pinned: ['1day dragon tiger','naughty button','chicken road','aviator x','aviatorx2','lankesh','mini aviator','mini jetx'],
  },
  {
    label: 'Roulette',
    keys: ['roulette','mini crashx','mini crash x','mini limbo','mini x roulette','lottery','lotto'],
  },
  {
    label: 'Dragon Tiger',
    keys: ['dragon tiger','dragon-tiger'],
  },
  {
    label: 'Teen Patti',
    keys: ['teen patti','teenpatti','teen-patti','3 patti','andar bahar'],
  },
  {
    label: 'Sexy',
    keys: ['sexy','saxy','ae sexy','sa gaming'],
  },
  {
    label: 'Crash',
    keys: ['crash','aviator','jetx','jet x','limbo','plinko','spaceman'],
  },
  {
    label: 'Poker',
    keys: ['poker','hold\'em','holdem','caribbean','texas'],
  },
  {
    label: 'Blackjack',
    keys: ['blackjack','black jack','21'],
  },
  {
    label: 'Trade88',
    keys: ['trade','trade88'],
  },
]

export function filterGames(games) {
  const used = new Set()
  const rows = []

  for (const row of GAME_ROWS) {
    const matched = games.filter(g => {
      const name = (g.name || '').toLowerCase()
      return row.keys.some(k => name.includes(k))
    })
    // deduplicate
    const unique = matched.filter(g => !used.has(g.game_uid))
    unique.forEach(g => used.add(g.game_uid))
    if (unique.length > 0) rows.push({ label: row.label, games: unique })
  }

  // Others — everything remaining
  const others = games.filter(g => !used.has(g.game_uid))
  if (others.length > 0) rows.push({ label: 'Other', games: others })

  return rows
}
