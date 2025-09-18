import axios from "axios"
import { cache } from "../utils/cache"
import { logger } from "../utils/logger"

interface TranslationResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
}

class TranslateService {
  private readonly supportedLanguages = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil",
    kn: "Kannada",
    ml: "Malayalam",
    gu: "Gujarati",
    mr: "Marathi",
    bn: "Bengali",
    pa: "Punjabi",
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    // If source and target are the same, return original text
    if (sourceLanguage === targetLanguage) {
      return text
    }

    const cacheKey = `translate_${sourceLanguage}_${targetLanguage}_${this.hashString(text)}`
    const cached = await cache.get(cacheKey)

    if (cached) {
      return cached.translatedText
    }

    try {
      // Using Google Translate API
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: "text",
        },
      )

      const translatedText = response.data.data.translations[0].translatedText

      const result: TranslationResponse = {
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95,
      }

      await cache.set(cacheKey, result, 86400) // Cache for 24 hours
      return translatedText
    } catch (error) {
      logger.error("Error translating text:", error)

      // Fallback to mock translation for development
      return this.mockTranslate(text, sourceLanguage, targetLanguage)
    }
  }

  async detectLanguage(text: string): Promise<string> {
    const cacheKey = `detect_${this.hashString(text)}`
    const cached = await cache.get(cacheKey)

    if (cached) {
      return cached
    }

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
        },
      )

      const detectedLanguage = response.data.data.detections[0][0].language
      await cache.set(cacheKey, detectedLanguage, 3600) // Cache for 1 hour

      return detectedLanguage
    } catch (error) {
      logger.error("Error detecting language:", error)
      return "en" // Default to English
    }
  }

  async batchTranslate(texts: string[], sourceLanguage: string, targetLanguage: string): Promise<string[]> {
    try {
      const translations = await Promise.all(texts.map((text) => this.translate(text, sourceLanguage, targetLanguage)))
      return translations
    } catch (error) {
      logger.error("Error in batch translation:", error)
      throw new Error("Failed to translate texts")
    }
  }

  getSupportedLanguages(): Record<string, string> {
    return this.supportedLanguages
  }

  isLanguageSupported(languageCode: string): boolean {
    return languageCode in this.supportedLanguages
  }

  private mockTranslate(text: string, sourceLanguage: string, targetLanguage: string): string {
    // Simple mock translation for development
    const mockTranslations: Record<string, Record<string, string>> = {
      en: {
        hi: `[HI] ${text}`,
        te: `[TE] ${text}`,
        ta: `[TA] ${text}`,
        kn: `[KN] ${text}`,
      },
      hi: {
        en: `[EN] ${text}`,
        te: `[TE] ${text}`,
        ta: `[TA] ${text}`,
      },
    }

    return mockTranslations[sourceLanguage]?.[targetLanguage] || text
  }

  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }
}

export const translateService = new TranslateService()
