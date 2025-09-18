interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatResponse {
  message: string
  type: "text" | "recommendation" | "weather" | "soil"
  confidence: number
  sources?: string[]
}

export class AIChatService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
  }

  async generateResponse(messages: ChatMessage[], userContext?: any): Promise<ChatResponse> {
    try {
      // Mock AI response generation
      const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ""

      let response: ChatResponse

      if (lastMessage.includes("crop") || lastMessage.includes("plant") || lastMessage.includes("grow")) {
        response = {
          message: this.generateCropAdvice(lastMessage, userContext),
          type: "recommendation",
          confidence: 0.85,
          sources: ["Agricultural Research Database", "Local Climate Data"],
        }
      } else if (
        lastMessage.includes("weather") ||
        lastMessage.includes("rain") ||
        lastMessage.includes("temperature")
      ) {
        response = {
          message: this.generateWeatherAdvice(lastMessage, userContext),
          type: "weather",
          confidence: 0.92,
          sources: ["Weather API", "Meteorological Department"],
        }
      } else if (
        lastMessage.includes("soil") ||
        lastMessage.includes("fertilizer") ||
        lastMessage.includes("nutrient")
      ) {
        response = {
          message: this.generateSoilAdvice(lastMessage, userContext),
          type: "soil",
          confidence: 0.78,
          sources: ["SoilGrids Database", "Agricultural Extension Services"],
        }
      } else {
        response = {
          message: this.generateGeneralAdvice(lastMessage, userContext),
          type: "text",
          confidence: 0.75,
        }
      }

      return response
    } catch (error) {
      console.error("AI Chat error:", error)
      throw new Error("Failed to generate AI response")
    }
  }

  private generateCropAdvice(query: string, context?: any): string {
    const cropAdvice = [
      "Based on your soil conditions and current weather patterns, I recommend considering winter wheat for this season. The soil pH and nutrient levels are well-suited for wheat cultivation.",
      "For your region and farm size, soybeans could be an excellent choice. They're nitrogen-fixing legumes that can improve your soil health while providing good market returns.",
      "Given the current market demand and your location's climate, corn cultivation shows promising potential. Ensure adequate irrigation during the flowering stage.",
      "Rice cultivation would be suitable for your area, especially with the upcoming monsoon season. Consider using certified seeds for better yield and disease resistance.",
    ]

    return cropAdvice[Math.floor(Math.random() * cropAdvice.length)]
  }

  private generateWeatherAdvice(query: string, context?: any): string {
    const weatherAdvice = [
      "Current weather conditions show favorable patterns for field operations. The next 3 days have low precipitation probability, making it ideal for planting or harvesting activities.",
      "A weather front is approaching with expected rainfall in 2-3 days. This would be beneficial for recently planted crops but may delay field work. Plan accordingly.",
      "Temperature patterns indicate optimal growing conditions for most crops. However, monitor for potential frost warnings in the early morning hours.",
      "Wind speeds are moderate, making it suitable for pesticide or fertilizer application. Avoid spraying during peak wind hours (10 AM - 4 PM).",
    ]

    return weatherAdvice[Math.floor(Math.random() * weatherAdvice.length)]
  }

  private generateSoilAdvice(query: string, context?: any): string {
    const soilAdvice = [
      "Your soil analysis indicates good organic matter content but slightly low phosphorus levels. I recommend applying a phosphorus-rich fertilizer before the next planting season.",
      "The soil pH is in the optimal range for most crops. Current nitrogen levels are moderate - consider split application of nitrogen fertilizer for better nutrient uptake.",
      "Soil moisture levels are adequate for current crop needs. However, monitor closely during dry periods and consider mulching to retain moisture.",
      "Your soil shows good potassium levels but could benefit from additional organic matter. Consider incorporating compost or green manure to improve soil structure.",
    ]

    return soilAdvice[Math.floor(Math.random() * soilAdvice.length)]
  }

  private generateGeneralAdvice(query: string, context?: any): string {
    const generalAdvice = [
      "I'm here to help with your farming questions! I can provide advice on crop selection, weather patterns, soil management, pest control, and general agricultural practices. What specific area would you like to explore?",
      "For the best farming advice, it's helpful to know your location, crop type, and current farming challenges. This allows me to provide more targeted recommendations based on local conditions.",
      "Agricultural success depends on many factors including soil health, weather patterns, crop selection, and proper timing. I can help you analyze each of these aspects for your specific situation.",
      "Consider implementing integrated farming practices that combine traditional knowledge with modern techniques. This approach often leads to sustainable and profitable farming outcomes.",
    ]

    return generalAdvice[Math.floor(Math.random() * generalAdvice.length)]
  }
}

export const aiChatService = new AIChatService()
