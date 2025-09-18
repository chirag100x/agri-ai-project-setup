import { Router } from "express"
import { body } from "express-validator"
import { ProfileController } from "../controllers/profileController"
import { validationMiddleware } from "../middleware/validationMiddleware"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()
const profileController = new ProfileController()

router.use(authMiddleware)

router.get("/", profileController.getProfile)
router.put(
  "/",
  [
    body("farmSize").optional().isNumeric(),
    body("primaryCrop").optional().isString(),
    body("location").optional().isObject(),
    validationMiddleware,
  ],
  profileController.updateProfile,
)

export default router
