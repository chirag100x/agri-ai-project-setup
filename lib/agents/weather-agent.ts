export interface WeatherData {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    rainfall: number
    condition: string
  }
  forecast: Array<{
    date: string
    maxTemp: number
    minTemp: number
    rainfall: number
    condition: string
  }>
  alerts: string[]
}

export class WeatherAgent {
  async getWeatherData(location: { lat: number; lng: number }): Promise<WeatherData> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockWeatherData: WeatherData = {
      current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        condition: "Partly Cloudy",
      },
      forecast: [
        {
          date: "2024-01-15",
          maxTemp: 32,
          minTemp: 22,
          rainfall: 5,
          condition: "Light Rain",
        },
        {
          date: "2024-01-16",
          maxTemp: 30,
          minTemp: 20,
          rainfall: 15,
          condition: "Moderate Rain",
        },
        {
          date: "2024-01-17",
          maxTemp: 29,
          minTemp: 19,
          rainfall: 0,
          condition: "Clear Sky",
        },
      ],
      alerts: ["Heavy rainfall expected in next 48 hours", "Strong winds may affect crop spraying operations"],
    }

    return mockWeatherData
  }

  async getFarmingAdvice(weatherData: WeatherData, cropType: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const advice = [
      "Postpone irrigation due to expected rainfall",
      "Cover sensitive crops before heavy rain",
      "Apply fungicide after rain stops to prevent diseases",
      "Check drainage systems to prevent waterlogging",
    ]

    return advice
  }
}
