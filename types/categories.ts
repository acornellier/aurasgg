const categories = [
  {
    id: 'class.paladin',
    text: 'Paladin',
  },
  {
    id: 'class.paladin.holy',
    text: 'Paladin',
  },
  {
    id: 'class.paladin.protection',
    text: 'Paladin',
  },
  {
    id: 'class.paladin.retribution',
    text: 'Paladin',
  },
]

export type Category = [typeof categories][number]
