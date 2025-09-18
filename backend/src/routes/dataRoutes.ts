import { Router } from "express"
import { dataController } from "../controllers/dataController"
import { authenticateToken } from "../middleware/authMiddleware"

const router = Router()

// Data routes
router.get("/weather/:location", authenticateToken, dataController.getWeatherData)
router.get("/soil/:location", authenticateToken, dataController.getSoilData)
router.get("/satellite/:location", authenticateToken, dataController.getSatelliteData)
router.get("/crops/recommendations", authenticateToken, dataController.getCropRecommendations)

export default router
