import { Router } from "express"
import { body } from "express-validator"
import {
  signup,
  login,
  logout,
  resetPassword,
  changePassword,
  getCurrentUser,
  updateProfile,
} from "../controllers/authController"
import { validationMiddleware } from "../middleware/validationMiddleware"
import { authMiddleware } from "../middleware/authMiddleware"

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

const resetPasswordValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
]

const changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain at least one lowercase letter, one uppercase letter, and one number"),
]

// Routes
router.post("/login", loginValidation, validationMiddleware, login)

router.post("/signup", signupValidation, validationMiddleware, signup)

router.post("/logout", logout)

router.post("/reset-password", resetPasswordValidation, validationMiddleware, resetPassword)

router.post("/change-password", authMiddleware, changePasswordValidation, validationMiddleware, changePassword)

router.get("/me", authMiddleware, getCurrentUser)

router.patch(
  "/profile",
  authMiddleware,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("farmName").optional().trim().isLength({ max: 100 }).withMessage("Farm name must be less than 100 characters"),
    body("location").optional().trim().isLength({ max: 100 }).withMessage("Location must be less than 100 characters"),
    body("farmSize").optional().isNumeric().withMessage("Farm size must be a number"),
    body("primaryCrop")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Primary crop must be less than 50 characters"),
  ],
  validationMiddleware,
  updateProfile,
)

export default router

