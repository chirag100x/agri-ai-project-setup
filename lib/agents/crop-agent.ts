export interface CropRecommendation {
  cropName: string
  suitabilityScore: number
  season: string
  expectedYield: string
  marketPrice: number
  growingTips: string[]
  riskFactors: string[]
}

export class CropAgent {
  async getRecommendations(
    location: { lat: number; lng: number },
    soilType: string,
    season: string,
  ): Promise<CropRecommendation[]> {
    // Mock AI response with realistic crop recommendations
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

    const mockRecommendations: CropRecommendation[] = [
      {
        cropName: "Rice",
        suitabilityScore: 92,
        season: "Kharif",
        expectedYield: "4-5 tons/hectare",
        marketPrice: 2500,
        growingTips: [
          "Maintain water level at 2-3 inches",
          "Apply nitrogen fertilizer in split doses",
          "Monitor for brown plant hopper",
        ],
        riskFactors: ["Flooding risk", "Pest infestation"],
      },
      {
        cropName: "Wheat",
        suitabilityScore: 88,
        season: "Rabi",
        expectedYield: "3-4 tons/hectare",
        marketPrice: 2200,
        growingTips: [
          "Sow seeds at 2-3 cm depth",
          "Irrigate at crown root initiation stage",
          "Apply phosphorus at sowing time",
        ],
        riskFactors: ["Late frost", "Rust disease"],
      },
      {
        cropName: "Sugarcane",
        suitabilityScore: 85,
        season: "Annual",
        expectedYield: "70-80 tons/hectare",
        marketPrice: 350,
        growingTips: [
          "Plant during February-March",
          "Maintain soil moisture at 70%",
          "Apply organic manure before planting",
        ],
        riskFactors: ["Drought stress", "Red rot disease"],
      },
    ]

    return mockRecommendations
  }

  async analyzeCropHealth(imageBase64: string): Promise<{
    healthScore: number
    diseases: string[]
    recommendations: string[]
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      healthScore: 78,
      diseases: ["Leaf blight", "Nutrient deficiency"],
      recommendations: ["Apply fungicide spray", "Increase nitrogen fertilizer", "Improve drainage system"],
    }
  }
}
