import { Router } from "express"
import { DataController } from "../controllers/dataController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()
const dataController = new DataController()

router.use(authMiddleware)

router.get("/weather/:location", dataController.getWeatherData)
router.get("/soil/:location", dataController.getSoilData)
router.get("/satellite/:location", dataController.getSatelliteData)
router.get("/crop-recommendations/:location", dataController.getCropRecommendations)

export default router
