import React from 'react'
import { useQuery } from 'react-query'

import { measureTime } from './measureTime'

import type { SearchResponse } from '../pages/api/search'

export type SearchResultProps = {
  query: string
  isLoading: boolean
  response: SearchResponse | null
  count: number
  seconds: string
}

export const useSearch = (query: string): SearchResultProps => {
  const [elapsed, setElapsed] = React.useState(0)
  const { data, isLoading } = useQuery<SearchResponse>(
    ['search', query],
    async () => {
      const [results, elapsed] = await measureTime(async () => {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        )
        return await response.json()
      })
      setElapsed(elapsed)

      return results
    }
  )

  let count = 0
  if (data?.success) {
    count = Object.values(data.results).reduce(
      (current, item) => current + item.length,
      0
    )
  }

  const seconds = (elapsed / 1000).toFixed(3)

  return {
    query,
    isLoading,
    response: data ?? null,
    count,
    seconds,
  }
}
