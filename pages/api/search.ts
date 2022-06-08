import { RedisClient } from '../../lib/redis'
import { search } from '../../lib/search/providers'

import type { SearchResults, SearchSort } from '../../lib/search/models'
import type { NextApiHandler, NextApiRequest } from 'next'

export type SearchResponse =
  | {
      success: true
      results: SearchResults
    }
  | {
      success: false
      error: string
    }

const handler: NextApiHandler<SearchResponse> = async (request, response) => {
  const query = parseRequestQuery(request, 'q')
  if (!query) {
    return response
      .status(400)
      .json({ success: false, error: 'Query parameter "q" is required.' })
  }

  const sort = parseRequestQuery<SearchSort>(request, 'sort')

  try {
    const results = await getOrPut(query, sort)
    response.status(200).json({
      success: true,
      results,
    })
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

const getOrPut = async (
  query: string,
  sort: SearchSort
): Promise<SearchResults> => {
  const response = await RedisClient.Instance.get<SearchResults>(query)
  if (response) {
    return response
  }

  const newResponse = await search(query, sort)
  await RedisClient.Instance.set(query, newResponse)
  return newResponse
}

export default handler
