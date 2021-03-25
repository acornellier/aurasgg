declare namespace Aura {
  export interface SearchAura extends AuraCommon {
    id: string
    screens: string[]
  }

  export type Type =
    | 'weakaura'
    | 'plater'
    | 'elvui'
    | 'mdt'
    | 'classic-weakaura'
    | 'vuhdo'

  export type MediaType = 'video' | 'screen'
  export type Media = { type: MediaType; src: string; thumb?: string }

  export type Category = import('./categories').Category

  export interface Aura {
    id: string
    type: Type
    date: { created: string; modified: string }
    code: string
    name: string
    categories: Category['id']
    description: { format: 'bbcode' | 'markdown'; text: string }
    views: number
    gallery: Media[]
    wago?: {
      slug: string
      categories: string[]
      username: string
    }
  }
}
