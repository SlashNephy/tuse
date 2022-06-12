import type {
  SearchResult,
  SearchSort,
  ISearchPlugin,
  PluginConfig,
} from '../../plugin'

export default class ScrapboxPagesSearchPlugin
  implements ISearchPlugin<'scrapbox.pages'>
{
  public readonly ApiLevel = 1
  public readonly Type = 'scrapbox.pages' as const

  public constructor(
    private config: PluginConfig<ScrapboxPagesSearchPluginConfig>
  ) {}

  public async search(
    q: string,
    _sort: SearchSort
  ): Promise<SearchResult<'scrapbox.pages'>[]> {
    const { projectName, connectSid } = this.config
    if (!projectName || !connectSid) {
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
      `https://scrapbox.io/api/pages/${projectName}/search/query?${query}`,
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
          cookie: `connect.sid=${connectSid}`,
        },
      }
    )
    const json = (await response.json()) as ScrapboxSearchResponse

    return json.pages.map((page) => this.intoSearchResult(page))
  }

  private intoSearchResult(
    page: ScrapboxSearchResponse['pages'][0]
  ): SearchResult<'scrapbox.pages'> {
    const { projectName } = this.config

    return {
      type: 'scrapbox.pages',
      title: page.title,
      url: `https://scrapbox.io/${projectName}/${encodeURIComponent(
        page.title
      )}`,
      imageUrl: page.image ?? undefined,
      description: page.lines.join('\n'),
    }
  }
}

type ScrapboxPagesSearchPluginConfig = {
  projectName?: string
  connectSid?: string
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
