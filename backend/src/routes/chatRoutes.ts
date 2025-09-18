import { Router } from "express"
import { body } from "express-validator"
import { chatController } from "../controllers/chatController"
import { validateRequest } from "../middleware/validationMiddleware"
import { authenticateToken } from "../middleware/authMiddleware"

const router = Router()

// Chat routes
router.post(
  "/message",
  authenticateToken,
  [body("message").notEmpty().withMessage("Message is required"), body("language").optional().isString()],
  validateRequest,
  chatController.sendMessage,
)

router.get("/history", authenticateToken, chatController.getChatHistory)

router.delete("/history/:messageId", authenticateToken, chatController.deleteMessage)

export default router
