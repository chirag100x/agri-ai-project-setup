import type { Request, Response, NextFunction } from "express"
import { chatService } from "../services/aiService"
import { validationResult } from "express-validator"

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { message, language, context } = req.body
    const userId = req.user?.id

    const response = await chatService.processMessage({
      message,
      language,
      context,
      userId,
    })

    res.json({
      success: true,
      data: response,
    })
  } catch (error) {
    next(error)
  }
}

export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    const { page = 1, limit = 20 } = req.query

    const history = await chatService.getChatHistory(userId, {
      page: Number(page),
      limit: Number(limit),
    })

    res.json({
      success: true,
      data: history,
    })
  } catch (error) {
    next(error)
  }
}

export const clearChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    await chatService.clearHistory(userId)

    res.json({
      success: true,
      message: "Chat history cleared successfully",
    })
  } catch (error) {
    next(error)
  }
}
