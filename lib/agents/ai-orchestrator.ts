import { CropAgent } from "./crop-agent"
import { WeatherAgent } from "./weather-agent"
import { BhuvanAgent } from "./bhuvan-agent"
import { SoilAgent } from "./soil-agent"

export interface FarmingInsight {
  type: "crop" | "weather" | "soil" | "satellite"
  title: string
  content: string
  priority: "high" | "medium" | "low"
  actionRequired: boolean
}

export class AIOrchestrator {
  private cropAgent: CropAgent
  private weatherAgent: WeatherAgent
  private bhuvanAgent: BhuvanAgent
  private soilAgent: SoilAgent

  constructor() {
    this.cropAgent = new CropAgent()
    this.weatherAgent = new WeatherAgent()
    this.bhuvanAgent = new BhuvanAgent()
    this.soilAgent = new SoilAgent()
  }

  async getComprehensiveInsights(
    location: { lat: number; lng: number },
    farmData: { cropType: string; farmSize: number; soilType: string },
  ): Promise<FarmingInsight[]> {
    try {
      // Run all agents in parallel for faster response
      const [cropRecs, weatherData, satelliteData, soilData] = await Promise.all([
        this.cropAgent.getRecommendations(location, farmData.soilType, "current"),
        this.weatherAgent.getWeatherData(location),
        this.bhuvanAgent.getSatelliteData(location.lat, location.lng, "2024-01-01", "2024-01-15"),
        this.soilAgent.analyzeSoil(location),
      ])

      const insights: FarmingInsight[] = []

      // Weather-based insights
      if (weatherData.alerts.length > 0) {
        insights.push({
          type: "weather",
          title: "Weather Alert",
          content: weatherData.alerts[0],
          priority: "high",
          actionRequired: true,
        })
      }

      // Crop recommendations
      if (cropRecs.length > 0) {
        insights.push({
          type: "crop",
          title: "Top Crop Recommendation",
          content: `${cropRecs[0].cropName} shows ${cropRecs[0].suitabilityScore}% suitability for your farm`,
          priority: "medium",
          actionRequired: false,
        })
      }

      // Satellite data insights
      if (satelliteData.data.healthIndex < 80) {
        insights.push({
          type: "satellite",
          title: "Crop Health Alert",
          content: `Satellite data shows crop health at ${satelliteData.data.healthIndex}%. Consider inspection.`,
          priority: "high",
          actionRequired: true,
        })
      }

      // Soil recommendations
      if (soilData.recommendations.length > 0) {
        insights.push({
          type: "soil",
          title: "Soil Management",
          content: soilData.recommendations[0].action,
          priority: "medium",
          actionRequired: true,
        })
      }

      return insights
    } catch (error) {
      console.error("Error getting comprehensive insights:", error)
      return []
    }
  }

  async processNaturalLanguageQuery(query: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock AI response based on query keywords
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("weather")) {
      return "Based on current weather data, expect light rainfall in the next 48 hours. Consider postponing any spraying operations and ensure proper drainage in your fields."
    }

    if (lowerQuery.includes("crop") || lowerQuery.includes("plant")) {
      return "For your soil type and current season, I recommend considering rice or wheat cultivation. Rice shows 92% suitability with expected yields of 4-5 tons per hectare."
    }

    if (lowerQuery.includes("soil")) {
      return "Your soil analysis shows good pH levels at 6.8, but nitrogen levels could be improved. Consider applying 50 kg/hectare of urea fertilizer."
    }

    if (lowerQuery.includes("satellite") || lowerQuery.includes("ndvi")) {
      return "Satellite imagery shows your crop health index at 82% with good vegetation coverage. NDVI values indicate healthy plant growth across most of your farm area."
    }

    return "I'm here to help with your farming questions! You can ask me about crop recommendations, weather forecasts, soil analysis, or satellite monitoring data."
  }
}
