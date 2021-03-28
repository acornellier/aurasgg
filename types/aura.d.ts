declare namespace Aura {
  export type Type =
    | 'weakaura'
    | 'plater'
    | 'elvui'
    | 'mdt'
    | 'classic-weakaura'
    | 'vuhdo'
    | 'totalrp3'

  export type MediaType = 'video' | 'screen'
  export type Media = { type: MediaType; src: string; thumb?: string }

  export interface Category {
    id: string
    text: string
    root: boolean
  }

  export interface Aura {
    id: string
    type: Type
    dateCreated: string
    dateModified: string
    code: string
    name: string
    categories: Category[]
    description: { format: 'bbcode' | 'markdown'; text: string }
    views: number
    gallery: Media[]
    wago?: {
      url: string
      username: string
    }
  }

  export interface SearchAura extends Aura {
    epochCreated: number
    epochModified: number
    categoryNames: string[]
  }
}
