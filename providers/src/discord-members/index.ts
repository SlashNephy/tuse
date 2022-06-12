import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

import type {
  ISearchPlugin,
  PluginConfig,
  SearchResult,
  SearchSort,
} from '../../plugin'
import type { APIGuildMember } from 'discord-api-types/v10'

export default class DiscordMembersSearchPlugin
  implements ISearchPlugin<'discord.members'>
{
  public readonly ApiLevel = 1
  public readonly Type = 'discord.members' as const

  private readonly client: REST | null = null
  private readonly guildId: string | undefined

  public constructor(config: PluginConfig<DiscordMembersSearchPluginConfig>) {
    const { botToken, guildId } = config
    if (botToken) {
      this.client = new REST({ version: '10' }).setToken(botToken)
      this.guildId = guildId
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

    return members.map(DiscordMembersSearchPlugin.intoSearchResult)
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

type DiscordMembersSearchPluginConfig = {
  guildId?: string
  botToken?: string
}
