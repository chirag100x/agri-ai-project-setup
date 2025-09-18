import { dataService } from "./dataService"
import { CropHistory } from "../models/CropHistory"
import { Profile } from "../models/Profile"
import logger from "../utils/logger"

interface RecommendationInput {
  userId: string
  location: { lat: number; lon: number }
  season: string
  farmSize: number
  soilType?: string
}

interface CropRecommendation {
  crop: string
  variety: string
  suitability: number
  expectedYield: number
  profitability: number
  riskLevel: "low" | "medium" | "high"
  reasons: string[]
  bestPractices: string[]
}

class RecommendationService {
  async generateCropRecommendations(input: RecommendationInput): Promise<CropRecommendation[]> {
    try {
      // Get user's farming history
      const history = await CropHistory.find({ userId: input.userId }).sort({ year: -1, season: -1 }).limit(5)

      // Get user's profile for preferences
      const profile = await Profile.findOne({ userId: input.userId })

      // Get current environmental data
      const weatherData = await dataService.getWeatherData(input.location.lat, input.location.lon)
      const soilData = await dataService.getSoilData(input.location.lat, input.location.lon)

      // Generate recommendations based on multiple factors
      const recommendations = await this.calculateRecommendations({
        input,
        history,
        profile,
        weather: weatherData,
        soil: soilData,
      })

      return recommendations.sort((a, b) => b.suitability - a.suitability)
    } catch (error) {
      logger.error("Error generating crop recommendations:", error)
      throw new Error("Failed to generate recommendations")
    }
  }

  async getSeasonalRecommendations(userId: string, season: string) {
    try {
      const profile = await Profile.findOne({ userId })
      if (!profile) {
        throw new Error("User profile not found")
      }

      const seasonalCrops = this.getSeasonalCrops(season)
      const recommendations = []

      for (const crop of seasonalCrops) {
        const recommendation = await this.analyzeCropSuitability(crop, profile, season)
        recommendations.push(recommendation)
      }

      return recommendations.sort((a, b) => b.suitability - a.suitability)
    } catch (error) {
      logger.error("Error getting seasonal recommendations:", error)
      throw new Error("Failed to get seasonal recommendations")
    }
  }

  async getMarketBasedRecommendations(location: { lat: number; lon: number }) {
    try {
      // Mock market data - in production, this would fetch from market APIs
      const marketData = await this.getMarketPrices(location)

      const recommendations = marketData.map((item) => ({
        crop: item.crop,
        currentPrice: item.price,
        trend: item.trend,
        demand: item.demand,
        profitability: this.calculateProfitability(item),
        recommendation: this.getMarketRecommendation(item),
      }))

      return recommendations
    } catch (error) {
      logger.error("Error getting market-based recommendations:", error)
      throw new Error("Failed to get market recommendations")
    }
  }

  private async calculateRecommendations(data: any): Promise<CropRecommendation[]> {
    const { input, history, profile, weather, soil } = data

    // Base crop database with characteristics
    const cropDatabase = [
      {
        name: "Rice",
        varieties: ["Basmati", "Jasmine", "Arborio"],
        waterRequirement: "high",
        soilPreference: ["clay", "loamy"],
        temperatureRange: [20, 35],
        season: ["kharif"],
        profitMargin: 0.25,
      },
      {
        name: "Wheat",
        varieties: ["Durum", "Hard Red", "Soft White"],
        waterRequirement: "medium",
        soilPreference: ["loamy", "clay_loam"],
        temperatureRange: [15, 25],
        season: ["rabi"],
        profitMargin: 0.3,
      },
      {
        name: "Corn",
        varieties: ["Sweet Corn", "Dent Corn", "Flint Corn"],
        waterRequirement: "medium",
        soilPreference: ["loamy", "sandy_loam"],
        temperatureRange: [18, 32],
        season: ["kharif", "rabi"],
        profitMargin: 0.28,
      },
      {
        name: "Soybean",
        varieties: ["Glycine Max", "Edamame"],
        waterRequirement: "medium",
        soilPreference: ["loamy", "clay_loam"],
        temperatureRange: [20, 30],
        season: ["kharif"],
        profitMargin: 0.35,
      },
      {
        name: "Cotton",
        varieties: ["Pima", "Upland", "Organic"],
        waterRequirement: "high",
        soilPreference: ["sandy_loam", "clay_loam"],
        temperatureRange: [25, 35],
        season: ["kharif"],
        profitMargin: 0.4,
      },
    ]

    const recommendations: CropRecommendation[] = []

    for (const crop of cropDatabase) {
      if (!crop.season.includes(input.season)) continue

      const suitability = this.calculateSuitability(crop, { weather, soil, input })
      const expectedYieldValue = this.calculateExpectedYield(crop, { weather, soil, input, history })
      const profitability = this.calculateProfitability({ crop, expectedYieldValue, farmSize: input.farmSize })
      const riskLevel = this.assessRiskLevel(crop, { weather, history })

      recommendations.push({
        crop: crop.name,
        variety: crop.varieties[0], // Select best variety
        suitability,
        expectedYield: expectedYieldValue,
        profitability,
        riskLevel,
        reasons: this.generateReasons(crop, { weather, soil, suitability }),
        bestPractices: this.getBestPractices(crop.name),
      })
    }

    return recommendations
  }

  private calculateSuitability(crop: any, data: any): number {
    let score = 0
    const factors = []

    // Soil compatibility (30%)
    if (crop.soilPreference.includes(data.soil.soilType)) {
      score += 30
      factors.push("soil_compatible")
    } else {
      score += 15
    }

    // Temperature compatibility (25%)
    const avgTemp = data.weather.current.temperature
    if (avgTemp >= crop.temperatureRange[0] && avgTemp <= crop.temperatureRange[1]) {
      score += 25
      factors.push("temperature_optimal")
    } else {
      score += 10
    }

    // Water availability (20%)
    const humidity = data.weather.current.humidity
    if (crop.waterRequirement === "high" && humidity > 70) {
      score += 20
    } else if (crop.waterRequirement === "medium" && humidity > 50) {
      score += 20
    } else if (crop.waterRequirement === "low") {
      score += 20
    } else {
      score += 10
    }

    // Soil nutrients (15%)
    if (data.soil.ph >= 6.0 && data.soil.ph <= 7.5) {
      score += 15
      factors.push("ph_optimal")
    } else {
      score += 8
    }

    // Farm size compatibility (10%)
    if (data.input.farmSize >= 1) {
      // Minimum 1 hectare
      score += 10
    } else {
      score += 5
    }

    return Math.min(score, 100)
  }

  private calculateExpectedYield(crop: any, data: any): number {
    // Base yield per hectare for different crops
    const baseYields: Record<string, number> = {
      Rice: 4.5,
      Wheat: 3.2,
      Corn: 5.8,
      Soybean: 2.1,
      Cotton: 1.8,
    }

    let expectedYieldValue = baseYields[crop.name] || 3.0

    // Adjust based on conditions
    if (data.soil.ph >= 6.0 && data.soil.ph <= 7.5) expectedYieldValue *= 1.1
    if (data.weather.current.humidity > 60) expectedYieldValue *= 1.05
    if (data.soil.organicMatter > 3) expectedYieldValue *= 1.15

    // Historical performance adjustment
    if (data.history && data.history.length > 0) {
      const avgHistoricalYield =
        data.history
          .filter((h: any) => h.crops.some((c: any) => c.name === crop.name))
          .reduce((sum: number, h: any) => {
            const cropData = h.crops.find((c: any) => c.name === crop.name)
            return sum + (cropData?.yield || 0)
          }, 0) / data.history.length

      if (avgHistoricalYield > 0) {
        expectedYieldValue = (expectedYieldValue + avgHistoricalYield) / 2
      }
    }

    return Math.round(expectedYieldValue * 100) / 100
  }

  private calculateProfitability(data: any): number {
    const { crop, expectedYield, farmSize } = data

    // Mock market prices (₹ per ton)
    const marketPrices: Record<string, number> = {
      Rice: 20000,
      Wheat: 18000,
      Corn: 15000,
      Soybean: 35000,
      Cotton: 45000,
    }

    // Mock production costs (₹ per hectare)
    const productionCosts: Record<string, number> = {
      Rice: 25000,
      Wheat: 20000,
      Corn: 22000,
      Soybean: 18000,
      Cotton: 30000,
    }

    const cropName = typeof crop === "string" ? crop : crop.name
    const revenue = (expectedYield || 3) * (farmSize || 1) * (marketPrices[cropName] || 20000)
    const cost = (farmSize || 1) * (productionCosts[cropName] || 25000)
    const profit = revenue - cost

    return Math.round(profit)
  }

  private assessRiskLevel(crop: any, data: any): "low" | "medium" | "high" {
    let riskScore = 0

    // Weather risk
    if (data.weather.current.temperature > 35 || data.weather.current.temperature < 10) {
      riskScore += 2
    }

    // Historical performance risk
    if (data.history && data.history.length > 0) {
      const failures = data.history.filter((h: any) =>
        h.crops.some((c: any) => c.name === crop.name && c.quality === "poor"),
      ).length

      if (failures > data.history.length * 0.3) {
        riskScore += 2
      }
    }

    // Market volatility (simplified)
    if (["Cotton", "Soybean"].includes(crop.name)) {
      riskScore += 1
    }

    if (riskScore >= 3) return "high"
    if (riskScore >= 1) return "medium"
    return "low"
  }

  private generateReasons(crop: any, data: any): string[] {
    const reasons = []

    if (crop.soilPreference.includes(data.soil.soilType)) {
      reasons.push(`Excellent soil compatibility with ${data.soil.soilType} soil`)
    }

    if (data.weather.current.humidity > 60) {
      reasons.push("Favorable humidity levels for growth")
    }

    if (data.suitability > 80) {
      reasons.push("High overall suitability score based on environmental factors")
    }

    return reasons
  }

  private getBestPractices(cropName: string): string[] {
    const practices: Record<string, string[]> = {
      Rice: [
        "Maintain water level at 2-5 cm during vegetative stage",
        "Apply nitrogen in 3 splits",
        "Use certified seeds for better yield",
      ],
      Wheat: [
        "Sow at optimal time (November-December)",
        "Maintain proper row spacing (20-23 cm)",
        "Apply balanced fertilization",
      ],
      Corn: ["Plant at 60cm x 20cm spacing", "Ensure adequate drainage", "Monitor for pest attacks regularly"],
      Soybean: ["Inoculate seeds with Rhizobium", "Maintain soil pH between 6.0-7.0", "Practice crop rotation"],
      Cotton: [
        "Use drip irrigation for water efficiency",
        "Monitor for bollworm attacks",
        "Maintain plant population of 1-1.5 lakh/hectare",
      ],
    }

    return (
      practices[cropName] || [
        "Follow recommended spacing",
        "Apply balanced fertilization",
        "Monitor for pests and diseases",
      ]
    )
  }

  private getSeasonalCrops(season: string): any[] {
    const seasonalMapping: Record<string, string[]> = {
      kharif: ["Rice", "Corn", "Cotton", "Soybean"],
      rabi: ["Wheat", "Barley", "Mustard", "Gram"],
      zaid: ["Corn", "Fodder", "Vegetables"],
    }

    return seasonalMapping[season] || []
  }

  private async getMarketPrices(location: { lat: number; lon: number }) {
    // Mock market data - replace with actual market API
    return [
      { crop: "Rice", price: 20000, trend: "up", demand: "high" },
      { crop: "Wheat", price: 18000, trend: "stable", demand: "medium" },
      { crop: "Corn", price: 15000, trend: "down", demand: "medium" },
      { crop: "Soybean", price: 35000, trend: "up", demand: "high" },
      { crop: "Cotton", price: 45000, trend: "stable", demand: "high" },
    ]
  }

  private getMarketRecommendation(item: any): string {
    if (item.trend === "up" && item.demand === "high") {
      return "Highly recommended - Strong market conditions"
    } else if (item.trend === "stable" && item.demand === "high") {
      return "Recommended - Stable market with good demand"
    } else if (item.trend === "down") {
      return "Consider alternatives - Market prices declining"
    }
    return "Moderate recommendation - Average market conditions"
  }

  private async analyzeCropSuitability(crop: string, profile: any, season: string) {
    try {
      const weatherData = await dataService.getWeatherData(profile.location.lat, profile.location.lon)
      const soilData = await dataService.getSoilData(profile.location.lat, profile.location.lon)

      // Simple suitability analysis
      const suitability = this.calculateSuitability(
        { name: crop, soilPreference: ["loamy"], temperatureRange: [15, 35], waterRequirement: "medium" },
        { weather: weatherData, soil: soilData, input: { season, farmSize: profile.farmSize } },
      )

      return {
        crop,
        suitability,
        season,
        reasons: [`Suitable for ${season} season`, "Good environmental conditions"],
        riskLevel: "medium" as const,
      }
    } catch (error) {
      logger.error(`Error analyzing crop suitability for ${crop}:`, error)
      return {
        crop,
        suitability: 50,
        season,
        reasons: ["Analysis unavailable"],
        riskLevel: "medium" as const,
      }
    }
  }
}

export const recommendationService = new RecommendationService()
