declare namespace Aura {
  export type Type =
    | 'weakaura'
    | 'plater'
    | 'elvui'
    | 'mdt'
    | 'classic-weakaura'
    | 'tbc-weakaura'
    | 'vuhdo'
    | 'totalrp3'

  export type MediaType = 'video' | 'screen'
  export type Media = { type: MediaType; src: string; thumb?: string }

  export interface Category {
    id: string
    text: string
    root: boolean
  }

  export interface AuraCommon {
    id: string
    type: Type
    epochCreated: number
    epochModified: number
    name: string
    categories: Category[]
    views: number
    gallery: Media[]
    wago?: {
      url: string
      username: string
    }
  }

  export interface Aura extends AuraCommon {
    code: string
    description: { format: 'bbcode' | 'markdown'; text: string }
  }

  export interface SearchAura extends AuraCommon {
    categoryNames: string[]
  }
}
