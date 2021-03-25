declare namespace Aura {
  interface AuraCommon {
    slug: string
    name: string
    type: string
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

  export interface Wago extends AuraCommon {
    screens: Array<{ src: string }>
  }

  export type Type =
    | 'weakaura'
    | 'plater'
    | 'elvui'
    | 'mdt'
    | 'classic-weakaura'

  export type MediaType = 'video' | 'screen'
  export type Media = { type: MediaType; src: string; thumb?: string }

  export interface Aura {
    id: string
    date: { created: string; modified: string }
    code: string
    name: string
    type: Type
    categories: Category[]
    description: { format: 'bbcode' | 'markdown'; text: string }
    views: number
    gallery: Media[]
    wago: Record<string, unknown>
  }
}
