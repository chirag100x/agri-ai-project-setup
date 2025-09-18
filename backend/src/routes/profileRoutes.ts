import { Router } from "express"
import { body } from "express-validator"
import { profileController } from "../controllers/profileController"
import { validateRequest } from "../middleware/validationMiddleware"
import { authenticateToken } from "../middleware/authMiddleware"

const router = Router()

// Profile routes
router.get("/", authenticateToken, profileController.getProfile)

router.put(
  "/",
  authenticateToken,
  [
    body("farmSize").optional().isNumeric(),
    body("location").optional().isString(),
    body("primaryCrop").optional().isString(),
  ],
  validateRequest,
  profileController.updateProfile,
)

export default router
