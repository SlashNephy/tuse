// Generated by dts-bundle-generator v6.11.0

export declare type SearchType =
  | 'github.commits'
  | 'discord.members'
  | 'discord.messages'
  | 'scrapbox.pages'
export declare type SearchResult<T = SearchType> = {
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
export declare type SearchSort = 'relevance' | 'date' | null
export declare abstract class SearchProvider<T = SearchType | string> {
  abstract readonly Type: T
  abstract search(q: string, sort: SearchSort): Promise<SearchResult<T>[]>
}

export {}