import OpenAI from "openai"
import { translateService } from "./translateService"
import { logger } from "../utils/logger"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

class VoiceService {
  async speechToText(audioBuffer: Buffer, language = "en"): Promise<string> {
    try {
      const audioFile = new File([audioBuffer], "audio.wav", { type: "audio/wav" }) as any

      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: language === "en" ? undefined : language,
      })

      return response.text
    } catch (error) {
      logger.error("Error in speech to text conversion:", error)
      throw new Error("Failed to convert speech to text")
    }
  }

  async textToSpeech(text: string, language = "en"): Promise<Buffer> {
    try {
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
      })

      const buffer = Buffer.from(await response.arrayBuffer())
      return buffer
    } catch (error) {
      logger.error("Error in text to speech conversion:", error)
      throw new Error("Failed to convert text to speech")
    }
  }

  async processVoiceMessage(
    audioBuffer: Buffer,
    language: string,
  ): Promise<{
    transcription: string
    response: string
    audioResponse: Buffer
  }> {
    try {
      // Convert speech to text
      const transcription = await this.speechToText(audioBuffer, language)

      // Process the message (this would typically call the chat service)
      let response = `I heard you say: "${transcription}". This is a sample response for voice processing.`

      // Translate response if needed
      if (language !== "en") {
        response = await translateService.translate(response, "en", language)
      }

      // Convert response to speech
      const audioResponse = await this.textToSpeech(response, language)

      return {
        transcription,
        response,
        audioResponse,
      }
    } catch (error) {
      logger.error("Error processing voice message:", error)
      throw new Error("Failed to process voice message")
    }
  }

  getSupportedLanguages(): string[] {
    return [
      "en",
      "hi",
      "te",
      "ta",
      "kn",
      "ml",
      "gu",
      "mr",
      "bn",
      "pa",
      "es",
      "fr",
      "de",
      "it",
      "pt",
      "ru",
      "ja",
      "ko",
      "zh",
    ]
  }

  async detectLanguage(audioBuffer: Buffer): Promise<string> {
    try {
      const audioFile = new File([audioBuffer], "audio.wav", { type: "audio/wav" }) as any

      // First transcribe without language specification
      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      })

      // Use a simple heuristic or another service to detect language
      // This is a simplified implementation
      const text = response.text.toLowerCase()

      // Basic language detection based on common words
      if (text.includes("namaste") || text.includes("kaise") || text.includes("kya")) return "hi"
      if (text.includes("vanakkam") || text.includes("eppadi") || text.includes("enna")) return "ta"
      if (text.includes("namaskara") || text.includes("hegidira") || text.includes("yaava")) return "kn"

      return "en" // Default to English
    } catch (error) {
      logger.error("Error detecting language:", error)
      return "en" // Default fallback
    }
  }
}

export const voiceService = new VoiceService()
