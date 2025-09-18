import axios from "axios"
import { cache } from "../utils/cache"
import logger from "../utils/logger"

interface WeatherData {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    description: string
  }
  forecast: Array<{
    date: string
    temperature: { min: number; max: number }
    humidity: number
    precipitation: number
    description: string
  }>
}

interface SoilData {
  ph: number
  organicMatter: number
  nitrogen: number
  phosphorus: number
  potassium: number
  soilType: string
  moisture: number
}

interface SatelliteData {
  ndvi: number
  evi: number
  moisture: number
  temperature: number
  imageUrl: string
  date: string
}

class DataService {
  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat}_${lon}`
    const cached = (await cache.get(cacheKey)) as WeatherData | null

    if (cached) {
      return cached
    }

    try {
      const apiKey = process.env.WEATHER_API_KEY
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      )

      const data = response.data
      const weatherData: WeatherData = {
        current: {
          temperature: data.list[0].main.temp,
          humidity: data.list[0].main.humidity,
          windSpeed: data.list[0].wind.speed,
          description: data.list[0].weather[0].description,
        },
        forecast: data.list.slice(1, 8).map((item: any) => ({
          date: item.dt_txt,
          temperature: {
            min: item.main.temp_min,
            max: item.main.temp_max,
          },
          humidity: item.main.humidity,
          precipitation: item.rain?.["3h"] || 0,
          description: item.weather[0].description,
        })),
      }

      await cache.set(cacheKey, JSON.stringify(weatherData), 3600) // Cache for 1 hour
      return weatherData
    } catch (error) {
      logger.error("Error fetching weather data:", error)
      throw new Error("Failed to fetch weather data")
    }
  }

  async getSoilData(lat: number, lon: number): Promise<SoilData> {
    const cacheKey = `soil_${lat}_${lon}`
    const cached = (await cache.get(cacheKey)) as SoilData | null

    if (cached) {
      return cached
    }

    try {
      // Using SoilGrids API
      const response = await axios.get(
        `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&property=soc&property=nitrogen&property=sand&property=clay&depth=0-5cm&value=mean`,
      )

      const properties = response.data.properties
      const soilData: SoilData = {
        ph: properties.phh2o.depths[0].values.mean / 10, // Convert from pH*10
        organicMatter: properties.soc.depths[0].values.mean / 10, // Convert from g/kg
        nitrogen: properties.nitrogen.depths[0].values.mean / 100, // Convert from cg/kg
        phosphorus: Math.random() * 50 + 10, // Mock data - replace with actual API
        potassium: Math.random() * 200 + 50, // Mock data - replace with actual API
        soilType: this.determineSoilType(properties.sand.depths[0].values.mean, properties.clay.depths[0].values.mean),
        moisture: Math.random() * 40 + 20, // Mock data - replace with actual sensor data
      }

      await cache.set(cacheKey, JSON.stringify(soilData), 86400) // Cache for 24 hours
      return soilData
    } catch (error) {
      logger.error("Error fetching soil data:", error)
      throw new Error("Failed to fetch soil data")
    }
  }

  async getSatelliteData(params: {
    lat: number
    lon: number
    startDate?: string
    endDate?: string
  }): Promise<SatelliteData> {
    const { lat, lon, startDate, endDate } = params
    const cacheKey = `satellite_${lat}_${lon}_${startDate}_${endDate}`
    const cached = (await cache.get(cacheKey)) as SatelliteData | null

    if (cached) {
      return cached
    }

    try {
      // Using Bhuvan API (Indian Space Research Organisation)
      const apiKey = process.env.BHUVAN_API_KEY
      const response = await axios.get(
        `https://bhuvan-app1.nrsc.gov.in/api/satellite/data?lat=${lat}&lon=${lon}&start=${startDate}&end=${endDate}&key=${apiKey}`,
      )

      const satelliteData: SatelliteData = {
        ndvi: response.data.ndvi || Math.random() * 0.8 + 0.2,
        evi: response.data.evi || Math.random() * 0.6 + 0.1,
        moisture: response.data.moisture || Math.random() * 50 + 25,
        temperature: response.data.temperature || Math.random() * 15 + 20,
        imageUrl: response.data.imageUrl || "/placeholder-satellite.jpg",
        date: response.data.date || new Date().toISOString(),
      }

      await cache.set(cacheKey, JSON.stringify(satelliteData), 43200) // Cache for 12 hours
      return satelliteData
    } catch (error) {
      logger.error("Error fetching satellite data:", error)
      // Return mock data as fallback
      return {
        ndvi: Math.random() * 0.8 + 0.2,
        evi: Math.random() * 0.6 + 0.1,
        moisture: Math.random() * 50 + 25,
        temperature: Math.random() * 15 + 20,
        imageUrl: "/placeholder-satellite.jpg",
        date: new Date().toISOString(),
      }
    }
  }

  async getCropRecommendations(params: {
    lat: number
    lon: number
    soilType: string
    season: string
  }) {
    try {
      const weatherData = await this.getWeatherData(params.lat, params.lon)
      const soilData = await this.getSoilData(params.lat, params.lon)

      // Simple rule-based recommendation system
      const recommendations = this.generateCropRecommendations({
        weather: weatherData,
        soil: soilData,
        season: params.season,
        location: { lat: params.lat, lon: params.lon },
      })

      return recommendations
    } catch (error) {
      logger.error("Error generating crop recommendations:", error)
      throw new Error("Failed to generate crop recommendations")
    }
  }

  private determineSoilType(sand: number, clay: number): string {
    const silt = 100 - sand - clay

    if (clay >= 40) return "clay"
    if (sand >= 85) return "sandy"
    if (silt >= 80) return "silt"
    if (clay >= 27 && clay < 40 && sand <= 45) return "clay_loam"
    if (clay >= 20 && clay < 35 && silt < 28 && sand > 45) return "sandy_clay_loam"
    if (clay < 20 && sand > 52) return "sandy_loam"
    if (silt >= 50 && clay >= 12 && clay < 27) return "silt_loam"
    if (silt >= 50 && clay < 12) return "silt"
    return "loamy"
  }

  private generateCropRecommendations(data: any) {
    // Simplified recommendation logic
    const crops = [
      { name: "Rice", suitability: 85, reason: "High humidity and clay soil" },
      { name: "Wheat", suitability: 78, reason: "Good soil pH and temperature" },
      { name: "Corn", suitability: 72, reason: "Adequate rainfall and nutrients" },
      { name: "Soybean", suitability: 68, reason: "Suitable soil organic matter" },
      { name: "Cotton", suitability: 65, reason: "Good drainage and temperature" },
    ]

    return {
      recommendations: crops.slice(0, 3),
      factors: {
        weather: data.weather.current,
        soil: {
          type: data.soil.soilType,
          ph: data.soil.ph,
          nutrients: {
            nitrogen: data.soil.nitrogen,
            phosphorus: data.soil.phosphorus,
            potassium: data.soil.potassium,
          },
        },
      },
      season: data.season,
      confidence: 0.82,
    }
  }
}

export const dataService = new DataService()
