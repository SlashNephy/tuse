import { REST } from '@discordjs/rest'

import { SearchProvider } from './SearchProvider'

import type { SearchResult, SearchSort } from './models'
import type { RouteLike } from '@discordjs/rest'
import type { APIGuildMember } from 'discord-api-types/v10'
import type { APIMessage, APIThreadChannel } from 'discord-api-types/v9'

export class DiscordMessagesProvider extends SearchProvider<'discord.messages'> {
  public readonly Type = 'discord.messages' as const

  private readonly client: REST | null = null
  private readonly guildId: string | null = null

  public constructor() {
    super()

    const token = process.env.DISCORD_USER_TOKEN
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client = new REST({ version: '9', authPrefix: '' as any }).setToken(
        token
      )
      this.guildId = process.env.DISCORD_GUILD_ID ?? null
    }
  }

  public async search(
    q: string,
    _sort: SearchSort
  ): Promise<SearchResult<'discord.messages'>[]> {
    if (!this.client || !this.guildId) {
      return []
    }

    const query = new URLSearchParams({
      content: q,
      include_nsfw: 'true',
    })
    const url = `/guilds/${this.guildId}/messages/search?${query}` as RouteLike
    const result = (await this.client.get(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
        'x-discord-locale': 'ja',
      },
    })) as DiscordSearchResult

    return result.messages
      .flat()
      .map((message) => this.intoSearchResult(message))
  }

  private intoSearchResult(
    message: APIMessage
  ): SearchResult<'discord.messages'> {
    const avatarHash = message.member?.avatar || message.author.avatar

    return {
      type: 'discord.messages',
      url: `https://discord.com/channels/${this.guildId}/${message.channel_id}/${message.id}`,
      imageUrl: message.embeds?.[0]?.thumbnail?.url,
      description: message.content,
      author: {
        name: `${message.author.username}#${message.author.discriminator}`,
        url: `https://discord.com/users/${message.author.id}`,
        imageUrl:
          avatarHash &&
          `https://cdn.discordapp.com/avatars/${message.author.id}/${avatarHash}.png`,
      },
      timestamp: {
        createdAt: Date.parse(message.timestamp),
        updatedAt: message.edited_timestamp
          ? Date.parse(message.edited_timestamp)
          : null,
      },
    }
  }
}

type DiscordSearchResult = {
  total_results: number
  messages: APIMessage[][]
  analytics_id: string
  threads: APIThreadChannel[]
  members: APIGuildMember[]
}