import { SearchProvider } from './SearchProvider'

import type { SearchResult, SearchSort } from './models'

export class ScrapboxPagesProvider extends SearchProvider<'scrapbox.pages'> {
  public readonly Type = 'scrapbox.pages' as const

  private readonly projectName: string | null = null
  private readonly sid: string | null = null

  public constructor() {
    super()

    this.projectName = process.env.SCRAPBOX_PROJECT_NAME ?? null
    this.sid = process.env.SCRAPBOX_CONNECT_SID ?? null
  }

  public async search(
    q: string,
    _sort: SearchSort
  ): Promise<SearchResult<'scrapbox.pages'>[]> {
    if (!this.projectName || !this.sid) {
      return []
    }

    const query = new URLSearchParams({
      skip: '0',
      sort: 'pageRank',
      limit: '100',
      q,
    })

    const { default: fetch } = await import('node-fetch')
    const response = await fetch(
      `https://scrapbox.io/api/pages/${this.projectName}/search/query?${query}`,
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
          cookie: `connect.sid=${this.sid}`,
        },
      }
    )
    const json = (await response.json()) as ScrapboxSearchResponse

    return json.pages.map((page) => this.intoSearchResult(page))
  }

  private intoSearchResult(
    page: ScrapboxSearchResponse['pages'][0]
  ): SearchResult<'scrapbox.pages'> {
    return {
      type: 'scrapbox.pages',
      title: page.title,
      url: `https://scrapbox.io/${this.projectName}/${encodeURIComponent(
        page.title
      )}`,
      imageUrl: page.image ?? undefined,
      description: page.lines.join('\n'),
    }
  }
}

type ScrapboxSearchResponse = {
  backend: string
  count: number
  existsExactTitleMatch: boolean
  limit: number
  pages: {
    file?: string
    id: string
    image: string
    lines: string[]
    title: string
    words: string[]
  }[]
  projectName: string
  query: {
    excludes: string[]
    words: string[]
  }
  searchQuery: string
}
