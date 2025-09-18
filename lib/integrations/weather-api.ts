interface WeatherResponse {
  location: string
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    uvIndex: number
  }
  forecast: Array<{
    date: string
    high: number
    low: number
    condition: string
    precipitation: number
  }>
  alerts?: Array<{
    type: string
    message: string
    severity: "low" | "medium" | "high"
  }>
}

export class WeatherAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || ""
    this.baseUrl = "https://api.openweathermap.org/data/2.5"
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherResponse> {
    try {
      // In a real implementation, you would make actual API calls
      // For now, we'll return mock data with some variation based on location
      const mockData: WeatherResponse = {
        location: `Location ${lat.toFixed(2)}, ${lon.toFixed(2)}`,
        current: {
          temperature: Math.round(20 + Math.random() * 15),
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 20),
          visibility: Math.round(8 + Math.random() * 7),
          pressure: Math.round(1000 + Math.random() * 30),
          uvIndex: Math.round(1 + Math.random() * 10),
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          high: Math.round(22 + Math.random() * 10),
          low: Math.round(12 + Math.random() * 8),
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
          precipitation: Math.round(Math.random() * 80),
        })),
        alerts:
          Math.random() > 0.7
            ? [
                {
                  type: "Weather Advisory",
                  message: "Possible thunderstorms in the evening",
                  severity: "medium",
                },
              ]
            : undefined,
      }

      return mockData
    } catch (error) {
      console.error("Weather API error:", error)
      throw new Error("Failed to fetch weather data")
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherResponse> {
    try {
      // Mock implementation - in real app, geocode city first
      return this.getCurrentWeather(28.6139, 77.209) // Default to Delhi coordinates
    } catch (error) {
      console.error("Weather API error:", error)
      throw new Error("Failed to fetch weather data")
    }
  }
}

export const weatherAPI = new WeatherAPI()
