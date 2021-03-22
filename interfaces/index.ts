// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

type AuraType = 'WEAKAURA' | 'MDT' | 'ELVUI' | 'PLATER' | 'VUHDO'

interface AuraCommon {
  slug: string
  name: string
  type: AuraType
  categories: string[]
  viewCount: number
  wagoUrl: string
  description: {
    type: 'bbcode' | 'markdown'
    text: string
  }
}

export interface SearchAura extends AuraCommon {
  id: string
  screens: string[]
}

export interface Aura extends AuraCommon {
  screens: Array<{ src: string }>
}
