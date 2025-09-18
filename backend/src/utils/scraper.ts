import axios from "axios"
import { logger } from "./logger"
import { cache } from "./cache"

export interface ScrapedData {
  title?: string
  content?: string
  metadata?: Record<string, any>
}

export class WebScraper {
  private static readonly USER_AGENT = "AgriAI-Bot/1.0"
  private static readonly TIMEOUT = 10000

  static async scrapeUrl(url: string, cacheKey?: string): Promise<ScrapedData | null> {
    try {
      // Check cache first
      if (cacheKey) {
        const cached = await cache.get(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      }

      const response = await axios.get(url, {
        timeout: this.TIMEOUT,
        headers: {
          "User-Agent": this.USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      })

      const data: ScrapedData = {
        title: this.extractTitle(response.data),
        content: this.extractContent(response.data),
        metadata: {
          url,
          scrapedAt: new Date().toISOString(),
          statusCode: response.status,
        },
      }

      // Cache the result
      if (cacheKey) {
        await cache.set(cacheKey, JSON.stringify(data), 3600) // 1 hour cache
      }

      return data
    } catch (error) {
      logger.error("Web scraping error:", { url, error })
      return null
    }
  }

  private static extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    return titleMatch ? titleMatch[1].trim() : ""
  }

  private static extractContent(html: string): string {
    // Simple content extraction - remove HTML tags
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  static async scrapeMultipleUrls(urls: string[]): Promise<ScrapedData[]> {
    const promises = urls.map((url) => this.scrapeUrl(url))
    const results = await Promise.allSettled(promises)

    return results
      .filter(
        (result): result is PromiseFulfilledResult<ScrapedData | null> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value as ScrapedData)
  }
}
