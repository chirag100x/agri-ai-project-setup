import OpenAI from "openai"
import { Message } from "../models/Message"
import { translateService } from "./translateService"
import { logger } from "../utils/logger"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChatMessage {
  message: string
  language: string
  context?: string
  userId: string
}

export interface MLModelInterface {
  predict(input: any): Promise<any>
  getConfidence(): number
  getModelInfo(): { name: string; version: string; accuracy: number }
}

export class CropPredictionModel implements MLModelInterface {
  async predict(input: { soilType: string; climate: string; season: string }) {
    // Mock implementation - replace with actual ML model
    const crops = ["wheat", "rice", "corn", "soybean", "cotton"]
    return {
      recommendations: crops.slice(0, 3),
      confidence: 0.85,
      factors: ["soil_compatibility", "climate_suitability", "market_demand"],
    }
  }

  getConfidence(): number {
    return 0.85
  }

  getModelInfo() {
    return {
      name: "CropPredictor",
      version: "1.0.0",
      accuracy: 0.87,
    }
  }
}

export class DiseasePredictionModel implements MLModelInterface {
  async predict(input: { cropType: string; symptoms: string[]; imageUrl?: string }) {
    // Mock implementation
    return {
      disease: "leaf_blight",
      confidence: 0.78,
      treatment: ["fungicide_spray", "improved_drainage", "crop_rotation"],
      severity: "moderate",
    }
  }

  getConfidence(): number {
    return 0.78
  }

  getModelInfo() {
    return {
      name: "DiseaseDetector",
      version: "1.2.0",
      accuracy: 0.82,
    }
  }
}

export class YieldForecastModel implements MLModelInterface {
  async predict(input: { cropType: string; area: number; inputs: any; weather: any }) {
    // Mock implementation
    return {
      expectedYield: 4.2,
      unit: "tons/hectare",
      confidence: 0.73,
      factors: ["weather_conditions", "soil_quality", "input_quality"],
    }
  }

  getConfidence(): number {
    return 0.73
  }

  getModelInfo() {
    return {
      name: "YieldForecaster",
      version: "1.1.0",
      accuracy: 0.79,
    }
  }
}

class ChatService {
  private cropModel = new CropPredictionModel()
  private diseaseModel = new DiseasePredictionModel()
  private yieldModel = new YieldForecastModel()

  async processMessage({ message, language, context, userId }: ChatMessage) {
    try {
      // Translate message to English if needed
      let processedMessage = message
      if (language !== "en") {
        processedMessage = await translateService.translate(message, language, "en")
      }

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are AgriAI, an expert agricultural assistant. Provide helpful, accurate advice about farming, crops, weather, and agricultural practices. Keep responses practical and actionable. Context: ${context || "general farming advice"}`,
          },
          {
            role: "user",
            content: processedMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      let response = completion.choices[0]?.message?.content || "I apologize, but I could not generate a response."

      // Translate response back to user's language if needed
      if (language !== "en") {
        response = await translateService.translate(response, "en", language)
      }

      // Save messages to database
      await this.saveMessage(userId, "user", message, { language, context })
      await this.saveMessage(userId, "assistant", response, { language, context, confidence: 0.9 })

      return {
        response,
        confidence: 0.9,
        language,
        suggestions: await this.generateSuggestions(processedMessage),
      }
    } catch (error) {
      logger.error("Error processing chat message:", error)
      throw new Error("Failed to process message")
    }
  }

  async getChatHistory(userId: string, options: { page: number; limit: number }) {
    try {
      const skip = (options.page - 1) * options.limit

      const messages = await Message.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(options.limit).lean()

      const total = await Message.countDocuments({ userId })

      return {
        messages: messages.reverse(),
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit),
        },
      }
    } catch (error) {
      logger.error("Error fetching chat history:", error)
      throw new Error("Failed to fetch chat history")
    }
  }

  async clearHistory(userId: string) {
    try {
      await Message.deleteMany({ userId })
      logger.info(`Cleared chat history for user: ${userId}`)
    } catch (error) {
      logger.error("Error clearing chat history:", error)
      throw new Error("Failed to clear chat history")
    }
  }

  private async saveMessage(userId: string, type: "user" | "assistant", content: string, metadata: any) {
    const sessionId = `session_${userId}_${new Date().toISOString().split("T")[0]}`

    await Message.create({
      userId,
      sessionId,
      type,
      content,
      metadata,
    })
  }

  private async generateSuggestions(message: string): Promise<string[]> {
    // Simple keyword-based suggestions
    const suggestions = []

    if (message.toLowerCase().includes("crop")) {
      suggestions.push("What crops grow best in my soil type?")
    }
    if (message.toLowerCase().includes("weather")) {
      suggestions.push("How will weather affect my crops this week?")
    }
    if (message.toLowerCase().includes("disease")) {
      suggestions.push("How can I prevent crop diseases?")
    }

    return suggestions.slice(0, 3)
  }

  // ML Model methods
  async predictCrop(input: any) {
    return await this.cropModel.predict(input)
  }

  async detectDisease(input: any) {
    return await this.diseaseModel.predict(input)
  }

  async forecastYield(input: any) {
    return await this.yieldModel.predict(input)
  }
}

export const chatService = new ChatService()
