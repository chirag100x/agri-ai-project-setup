interface SoilResponse {
  location: string
  testDate: string
  ph: {
    value: number
    status: "low" | "optimal" | "high"
    recommendation: string
  }
  nutrients: {
    nitrogen: { value: number; status: "low" | "medium" | "high"; unit: string }
    phosphorus: { value: number; status: "low" | "medium" | "high"; unit: string }
    potassium: { value: number; status: "low" | "medium" | "high"; unit: string }
  }
  organicMatter: {
    value: number
    status: "low" | "medium" | "high"
    unit: string
  }
  moisture: {
    value: number
    status: "low" | "optimal" | "high"
    unit: string
  }
  recommendations: string[]
}

export class SoilAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = "https://rest.isric.org/soilgrids/v2.0"
  }

  async getSoilData(lat: number, lon: number): Promise<SoilResponse> {
    try {
      // Mock implementation - in real app, integrate with SoilGrids API
      const mockData: SoilResponse = {
        location: `Field at ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        testDate: new Date().toISOString().split("T")[0],
        ph: {
          value: Number((6.5 + Math.random() * 2).toFixed(1)),
          status: "optimal",
          recommendation: "Soil pH is in the optimal range for most crops.",
        },
        nutrients: {
          nitrogen: {
            value: Math.round(200 + Math.random() * 200),
            status: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
            unit: "kg/ha",
          },
          phosphorus: {
            value: Math.round(10 + Math.random() * 30),
            status: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
            unit: "ppm",
          },
          potassium: {
            value: Math.round(250 + Math.random() * 200),
            status: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
            unit: "kg/ha",
          },
        },
        organicMatter: {
          value: Number((2 + Math.random() * 3).toFixed(1)),
          status: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          unit: "%",
        },
        moisture: {
          value: Math.round(15 + Math.random() * 15),
          status: "optimal",
          unit: "%",
        },
        recommendations: [
          "Apply balanced NPK fertilizer before planting season",
          "Consider adding organic compost to improve soil structure",
          "Monitor soil moisture levels during dry periods",
          "Test soil annually for optimal crop management",
        ],
      }

      // Adjust pH status based on value
      if (mockData.ph.value < 6.0) {
        mockData.ph.status = "low"
        mockData.ph.recommendation = "Soil is acidic. Consider applying lime to raise pH."
      } else if (mockData.ph.value > 8.0) {
        mockData.ph.status = "high"
        mockData.ph.recommendation = "Soil is alkaline. Consider applying sulfur to lower pH."
      }

      return mockData
    } catch (error) {
      console.error("Soil API error:", error)
      throw new Error("Failed to fetch soil data")
    }
  }
}

export const soilAPI = new SoilAPI()
