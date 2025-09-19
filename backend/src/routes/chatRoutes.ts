import { Router } from "express"
import { chatController } from "../controllers/chatController"
import { validateRequest } from "../middleware/validationMiddleware"
import { body, query } from "express-validator"

const router = Router()

// Chat message validation
const chatMessageValidation = [
  body("message").notEmpty().withMessage("Message is required").isLength({ max: 1000 }).withMessage("Message too long"),
  body("language")
    .optional()
    .isIn(["en", "hi", "te", "ta", "kn", "ml", "gu", "mr", "bn", "pa"])
    .withMessage("Invalid language"),
  body("context").optional().isString().withMessage("Context must be a string"),
]

// Chat history validation
const chatHistoryValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
]

// Routes
router.post("/message", chatMessageValidation, validateRequest, chatController.sendMessage)
router.get("/history", chatHistoryValidation, validateRequest, chatController.getChatHistory)
router.delete("/history", chatController.clearHistory)
router.post("/voice", chatController.processVoiceMessage)

// ML prediction routes
router.post("/predict/crop", chatController.predictCrop)
router.post("/predict/disease", chatController.detectDisease)
router.post("/predict/yield", chatController.forecastYield)

export default router
