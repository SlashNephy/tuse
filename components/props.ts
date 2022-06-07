import type { SearchResponse } from '../pages/api/search'

export type SearchResultProps = {
  query: string
  isLoading: boolean
  response: SearchResponse | null
  count: number
  seconds: string
}
