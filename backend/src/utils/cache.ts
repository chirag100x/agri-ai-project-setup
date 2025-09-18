import { createClient } from "redis"
import { logger } from "./logger"

class CacheService {
  private client: any
  private connected = false

  constructor() {
    if (process.env.REDIS_URL) {
      this.client = createClient({
        url: process.env.REDIS_URL,
      })

      this.client.on("error", (err: Error) => {
        logger.error("Redis Client Error", err)
        this.connected = false
      })

      this.client.on("connect", () => {
        logger.info("Redis Client Connected")
        this.connected = true
      })

      this.connect()
    }
  }

  private async connect() {
    try {
      if (this.client) {
        await this.client.connect()
      }
    } catch (error) {
      logger.error("Failed to connect to Redis:", error)
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.connected || !this.client) {
      return null
    }

    try {
      return await this.client.get(key)
    } catch (error) {
      logger.error("Cache get error:", error)
      return null
    }
  }

  async set(key: string, value: string, ttl = 3600): Promise<boolean> {
    if (!this.connected || !this.client) {
      return false
    }

    try {
      await this.client.setEx(key, ttl, value)
      return true
    } catch (error) {
      logger.error("Cache set error:", error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.connected || !this.client) {
      return false
    }

    try {
      await this.client.del(key)
      return true
    } catch (error) {
      logger.error("Cache delete error:", error)
      return false
    }
  }
}

export const cache = new CacheService()
