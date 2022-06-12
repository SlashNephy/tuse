import { useQuery } from 'react-query'

import type { SearchResultProps } from '../components/props'
import type { SearchResponse } from '../pages/api/search'

export const useSearch = (query: string): SearchResultProps => {
  const { data, isLoading } = useQuery<SearchResponse>(
    ['search', query],
    async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      return await response.json()
    }
  )

  let count = 0
  if (data?.success) {
    count = Object.values(data.results).reduce(
      (current, item) => current + (item?.length ?? 0),
      0
    )
  }

  const seconds = ((data?.elapsed ?? 0) / 1000).toFixed(3)

  return {
    query,
    isLoading,
    response: data ?? null,
    count,
    seconds,
  }
}
