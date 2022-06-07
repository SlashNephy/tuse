export type SearchType =
  | 'github.commits'
  | 'discord.members'
  | 'discord.messages'
  | 'scrapbox.pages'

export type SearchResult<T = SearchType> = {
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

export type SearchSort = 'relevance' | 'date' | null
