import { REST } from '@discordjs/rest'
import { Octokit } from '@octokit/rest'
import { Routes } from 'discord-api-types/v10'

import type { RouteLike } from '@discordjs/rest'
import type { operations } from '@octokit/openapi-types'
import type { APIGuildMember } from 'discord-api-types/v10'
import type { APIMessage, APIThreadChannel } from 'discord-api-types/v9'

export type SearchResult = {
  type: 'github.commits' | 'discord.members' | 'discord.messages'
  title: string
  url: string
  imageUrl?: string
  description?: string
  author: {
    name: string
    url?: string
    imageUrl?: string
  }
  createdAt: number
  updatedAt?: number
}

export const search = async (q: string): Promise<SearchResult[]> => {
  const promises = await Promise.allSettled([
    searchGitHubCommits(q),
    searchDiscordMembers(q),
    searchDiscordMessages(q),
  ])

  const results: SearchResult[] = []
  for (const promise of promises) {
    switch (promise.status) {
      case 'fulfilled':
        results.push(...promise.value)
        break
      case 'rejected':
        console.error(promise.reason)
    }
  }

  return results.sort((a, b) => b.createdAt - a.createdAt)
}

const searchGitHubCommits = async (q: string): Promise<SearchResult[]> => {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return []
  }

  const client = new Octokit({
    auth: token,
  })
  const response = await client.search.commits({
    q,
  })
  const commits: operations['search/commits']['responses'][200]['content']['application/json']['items'] =
    response.data.items

  return commits.map((commit) => ({
    type: 'github.commits',
    title: `${commit.repository.full_name}#${commit.sha.substring(0, 7)}`,
    description: commit.commit.message,
    url: commit.html_url,
    author: {
      name: commit.author?.name ?? commit.commit.author.name,
      url: commit.author?.html_url,
      imageUrl: commit.author?.avatar_url,
    },
    createdAt: Date.parse(commit.commit.author.date),
  }))
}

const searchDiscordMembers = async (q: string): Promise<SearchResult[]> => {
  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) {
    return []
  }

  const guildId = process.env.DISCORD_GUILD_ID
  if (!guildId) {
    return []
  }

  const client = new REST({ version: '10' }).setToken(token)
  const members = (await client.get(Routes.guildMembersSearch(guildId), {
    query: new URLSearchParams({
      query: q,
      limit: '1000',
    }),
  })) as APIGuildMember[]

  return members.map((member) => ({
    type: 'discord.members',
    title: `${member.user?.username}#${member.user?.discriminator}`,
    url: `https://discordapp.com/users/${member.user?.id}`,
    description: member.user?.username,
    author: {
      name: member.nick ?? member.user?.username ?? '',
      url: `https://discordapp.com/users/${member.user?.id}`,
      imageUrl: member.user?.avatar ?? undefined,
    },
    createdAt: Date.parse(member.joined_at),
  }))
}

const searchDiscordMessages = async (q: string): Promise<SearchResult[]> => {
  const token = process.env.DISCORD_USER_TOKEN
  if (!token) {
    return []
  }

  const guildId = process.env.DISCORD_GUILD_ID
  if (!guildId) {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = new REST({ version: '9', authPrefix: '' as any }).setToken(
    token
  )
  const query = new URLSearchParams({
    content: q,
    include_nsfw: 'true',
  })
  const url = `/guilds/${guildId}/messages/search?${query}`
  const result = (await client.get(url as RouteLike, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
      'x-discord-locale': 'ja',
    },
  })) as DiscordSearchResult

  return result.messages.flat().map((message) => ({
    type: 'discord.messages',
    title: `${message.author.username}#${message.author.discriminator}`,
    url: `https://discordapp.com/channels/${message.channel_id}/${message.id}`,
    description: message.content,
    author: {
      name: message.author.username,
    },
    createdAt: Date.parse(message.timestamp),
  }))
}

type DiscordSearchResult = {
  total_results: number
  messages: APIMessage[][]
  analytics_id: string
  threads: APIThreadChannel[]
  members: APIGuildMember[]
}
