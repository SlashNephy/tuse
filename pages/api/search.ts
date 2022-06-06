import type { NextApiRequest, NextApiResponse } from 'next'

export type SearchResponse =
  | {
      success: true
      results: {
        title: string
        url: string
        description: string
        updatedAt: number
      }[]
    }
  | {
      success: false
      error: string
    }

const handler = (req: NextApiRequest, res: NextApiResponse<SearchResponse>) => {
  const { q } = req.query
  if (typeof q !== 'string') {
    return res
      .status(400)
      .json({ success: false, error: 'Query parameter `q` is required.' })
  }

  res.status(200).json({
    success: true,
    results: [
      {
        title: 'Next.js',
        url: 'https://nextjs.org/docs',
        description: 'A framework for server-rendered React apps',
        updatedAt: 1514764907000,
      },
    ],
  })
}

export default handler
