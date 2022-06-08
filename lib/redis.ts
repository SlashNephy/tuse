import { createClient } from 'redis'

import type { RedisClientType } from 'redis'

export class RedisClient {
  public static Instance = new RedisClient()

  private readonly client: RedisClientType
  private readonly expires: number

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URI,
    })
    this.client.on('error', (error) => {
      console.log('Redis Client Error', error)
    })

    this.expires = process.env.REDIS_CACHE_EXPIRES
      ? parseInt(process.env.REDIS_CACHE_EXPIRES)
      : 60 * 60
  }

  public async get<T>(key: string): Promise<T | null> {
    const cache = await this.client.get(key)
    return cache ? JSON.parse(cache) : null
  }

  public async set<T>(key: string, response: T): Promise<void> {
    await this.client.set(key, JSON.stringify(response))
    await this.client.expire(key, this.expires)
  }
}
