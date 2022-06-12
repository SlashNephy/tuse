export type PluginApiLevel = 1
export type PluginConfig<T = Record<string, unknown>> = Record<
  string,
  unknown
> &
  T

export interface ISearchPlugin<T = string> {
  readonly ApiLevel: PluginApiLevel
  readonly Type: T

  search(q: string, sort: SearchSort): Promise<SearchResult<T>[]>
}

export type SearchPluginConstructor<T = string> = new (
  config: PluginConfig
) => ISearchPlugin<T>

export type SearchSort = 'relevance' | 'date' | null

export type SearchResult<T = string> = {
  type: T
  url: string
  title?: string
  imageUrl?: string | null
  description?: string | null
  author?: {
    name: string
    url?: string | null
    imageUrl?: string | null
  }
  timestamp?: {
    createdAt: number
    updatedAt?: number | null
  }
}
