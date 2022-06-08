import { DiscordMessagesProvider } from './DiscordMessagesProvider'
import { ScrapboxPagesProvider } from './ScrapboxPagesProvider'

import type { SearchResult, SearchSort, SearchType } from './models'

const providers = [
  new ScrapboxPagesProvider(),
  new DiscordMessagesProvider(),
  // new DiscordMembersProvider(),
  // new GitHubCommitsProvider(),
] as const

export const search = async (
  q: string,
  sort: SearchSort
): Promise<{
  [type in SearchType]?: SearchResult[]
}> => {
  // どれか死んでても返せるように allSettled を使う
  const promises = await Promise.allSettled(
    providers.map(async (provider) =>
      provider.search(q, sort).then((results) => {
        return {
          [provider.Type]: results,
        }
      })
    )
  )

  return promises.reduce((current, promise) => {
    if (promise.status === 'fulfilled') {
      return {
        ...current,
        ...promise.value,
      }
    } else {
      console.error(promise.reason)
      return current
    }
  }, {})
}
