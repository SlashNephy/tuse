import { addHours } from 'date-fns'

import { search } from '../../lib/search/search'

import type { SearchSort } from '../../lib/search/plugin'
import type { ClientSearchResult } from '../../lib/search/search'
import type { NextApiHandler, NextApiRequest } from 'next'

export type SearchResponse =
  | {
      success: true
      results: {
        [type in string]: ClientSearchResult[]
      }
    }
  | {
      success: false
      error: string
    }

type CacheState = {
  response: SearchResponse
  expiresAt: Date
}

const cache = new Map<string, CacheState>()

const handler: NextApiHandler<SearchResponse> = async (request, response) => {
  const query = parseRequestQuery(request, 'q')
  if (!query) {
    return response.status(400).json({
      success: false,
      error: 'Query parameter "q" is required.',
    })
  }

  const sort = parseRequestQuery<SearchSort>(request, 'sort')

  try {
    let state = cache.get(query)
    if (!state || state.expiresAt < new Date()) {
      state = {
        response: {
          success: true,
          results: await search(query, sort),
        },
        expiresAt: addHours(new Date(), 1),
      }
      cache.set(query, state)
    }

    response.status(200).json(state.response)
  } catch (error) {
    return response.status(500).json({ success: false, error: `${error}` })
  }
}

const parseRequestQuery = <T = string>(
  request: NextApiRequest,
  key: string
): T | null => {
  if (!(key in request.query)) {
    return null
  }

  const value = request.query[key]
  return typeof value === 'string' ? (value as unknown as T) : null
}

export default handler
