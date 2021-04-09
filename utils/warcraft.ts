export const classes = [
  'Death Knight',
  'Demon Hunter',
  'Druid',
  'Hunter',
  'Mage',
  'Monk',
  'Paladin',
  'Priest',
  'Rogue',
  'Shaman',
  'Warlock',
  'Warrior',
] as const
export type Class = typeof classes[number]

export const dungeons = [
  'De Other Side',
  'Halls Of Attonement',
  'Mists Of Tirna Scithe',
  'Plaguefall',
  'Sanguine Depths',
  'Spires Of Ascension',
  'The Necrotic Wake',
  'Theater Of Pain',
] as const
export type Dungeon = typeof dungeons[number]
