import { Octokit } from '@octokit/rest'

import type {
  ISearchPlugin,
  PluginConfig,
  SearchResult,
  SearchSort,
} from '../../plugin'
import type { operations } from '@octokit/openapi-types'
import * as React from 'react'
import { BrandGithub } from 'tabler-icons-react'

export default class GitHubCommitsSearchPlugin
  implements ISearchPlugin<'github.commits'>
{
  public readonly info = {
    apiVersion: 1 as const,
    type: 'github.commits' as const,
    name: 'GitHub コミット',
    renderIcon: () => <BrandGithub size={16} />,
  }

  private readonly client: Octokit | null = null

  public constructor(config: PluginConfig<GitHubCommitsSearchPluginConfig>) {
    const { token } = config
    if (token) {
      this.client = new Octokit({
        auth: token,
      })
    }
  }

  public async search(
    q: string,
    _sort: SearchSort
  ): Promise<SearchResult<'github.commits'>[]> {
    if (!this.client) {
      return []
    }

    const response = await this.client.search.commits({
      q,
    })
    const commits: operations['search/commits']['responses'][200]['content']['application/json']['items'] =
      response.data.items

    return commits.map(GitHubCommitsSearchPlugin.intoSearchResult)
  }

  private static intoSearchResult(
    commit: operations['search/commits']['responses'][200]['content']['application/json']['items'][0]
  ): SearchResult<'github.commits'> {
    return {
      type: 'github.commits',
      title: `${commit.repository.full_name}#${commit.sha.substring(0, 7)}`,
      description: commit.commit.message,
      url: commit.html_url,
      author: {
        name: commit.author?.name ?? commit.commit.author.name,
        url: commit.author?.html_url,
        imageUrl: commit.author?.avatar_url,
      },
      timestamp: {
        createdAt: Date.parse(commit.commit.author.date),
      },
    }
  }
}

type GitHubCommitsSearchPluginConfig = {
  token?: string
}
