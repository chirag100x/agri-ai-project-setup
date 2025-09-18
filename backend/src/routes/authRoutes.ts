import { Router } from "express"
import { body } from "express-validator"
import { authController } from "../controllers/authController"
import { validateRequest } from "../middleware/validationMiddleware"
import { authenticateToken } from "../middleware/authMiddleware"

const router = Router()

// Validation schemas
const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

const signupValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("farmName").optional().trim().isLength({ max: 100 }).withMessage("Farm name must be less than 100 characters"),
  body("location").optional().trim().isLength({ max: 100 }).withMessage("Location must be less than 100 characters"),
]

// Routes
router.post("/login", loginValidation, validateRequest, authController.login)
router.post("/signup", signupValidation, validateRequest, authController.signup)
router.post("/logout", authController.logout)
router.get("/me", authenticateToken, authController.getCurrentUser)

export default router
