import { createClient } from "redis"
import { logger } from "./logger"

class CacheService {
  private client: any
  private isConnected = false

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    })

    this.client.on("error", (err: Error) => {
      logger.error("Redis Client Error:", err)
      this.isConnected = false
    })

    this.client.on("connect", () => {
      logger.info("Redis Client Connected")
      this.isConnected = true
    })
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.client.connect()
      } catch (error) {
        logger.error("Failed to connect to Redis:", error)
      }
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) return null

    try {
      return await this.client.get(key)
    } catch (error) {
      logger.error("Cache get error:", error)
      return null
    }
  }

  async set(key: string, value: string, ttl = 3600): Promise<boolean> {
    if (!this.isConnected) return false

    try {
      await this.client.setEx(key, ttl, value)
      return true
    } catch (error) {
      logger.error("Cache set error:", error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected) return false

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
