import type { Request, Response, NextFunction } from "express"
import { dataService } from "../services/dataService"

export class DataController {
  static async getWeatherData(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon } = req.query

      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" })
      }

      const weatherData = await dataService.getWeatherData(Number(lat), Number(lon))

      res.json({
        success: true,
        data: weatherData,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getSoilData(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon } = req.query

      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" })
      }

      const soilData = await dataService.getSoilData(Number(lat), Number(lon))

      res.json({
        success: true,
        data: soilData,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getSatelliteData(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, startDate, endDate } = req.query

      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" })
      }

      const satelliteData = await dataService.getSatelliteData({
        lat: Number(lat),
        lon: Number(lon),
        startDate: startDate as string,
        endDate: endDate as string,
      })

      res.json({
        success: true,
        data: satelliteData,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getCropRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, soilType, season } = req.query

      const recommendations = await dataService.getCropRecommendations({
        lat: Number(lat),
        lon: Number(lon),
        soilType: soilType as string,
        season: season as string,
      })

      res.json({
        success: true,
        data: recommendations,
      })
    } catch (error) {
      next(error)
    }
  }
}
