import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

import { SearchProvider } from './SearchProvider'

import type { SearchResult, SearchSort } from './models'
import type { APIGuildMember } from 'discord-api-types/v10'

export class DiscordMembersProvider extends SearchProvider<'discord.members'> {
  public readonly Type = 'discord.members' as const

  private readonly client: REST | null = null
  private readonly guildId: string | null = null

  public constructor() {
    super()

    const token = process.env.DISCORD_BOT_TOKEN
    if (token) {
      this.client = new REST({ version: '10' }).setToken(token)
      this.guildId = process.env.DISCORD_GUILD_ID ?? null
    }
  }

  public async search(
    q: string,
    _sort: SearchSort
  ): Promise<SearchResult<'discord.members'>[]> {
    if (!this.client || !this.guildId) {
      return []
    }

    const members = (await this.client.get(
      Routes.guildMembersSearch(this.guildId),
      {
        query: new URLSearchParams({
          query: q,
          limit: '1000',
        }),
      }
    )) as APIGuildMember[]

    return members.map(DiscordMembersProvider.intoSearchResult)
  }

  private static intoSearchResult(
    member: APIGuildMember
  ): SearchResult<'discord.members'> {
    const avatarHash = member.avatar || member.user?.avatar

    return {
      type: 'discord.members',
      title: `${member.user?.username}#${member.user?.discriminator}`,
      url: `https://discord.com/users/${member.user?.id}`,
      imageUrl:
        avatarHash &&
        `https://cdn.discordapp.com/avatars/${member.user?.id}/${avatarHash}.png`,
      description: member.user?.username,
      timestamp: {
        createdAt: Date.parse(member.joined_at),
      },
    }
  }
}
