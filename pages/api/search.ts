import { addHours } from 'date-fns'

import { search } from '../../lib/search'

import type { SearchResult } from '../../lib/search'
import type { NextApiRequest, NextApiResponse } from 'next'

export type SearchResponse =
  | {
      success: true
      results: SearchResult[]
    }
  | {
      success: false
      error: string
    }

type CacheState = {
  results: SearchResult[]
  expiresAt: Date
}

const cache: Map<string, CacheState> = new Map()

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) => {
  const { q } = req.query
  if (typeof q !== 'string') {
    return res
      .status(400)
      .json({ success: false, error: 'Query parameter "q" is required.' })
  }

  try {
    let state = cache.get(q)
    if (!state || state.expiresAt < new Date()) {
      state = {
        results: await search(q),
        expiresAt: addHours(new Date(), 1),
      }
      cache.set(q, state)
    }

    res.status(200).json({
      success: true,
      results: state.results,
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: `${error}` })
  }
}

export default handler
