import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import logger from "../utils/logger"

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "Invalid token." })
    }

    req.user = user
    next()
  } catch (error) {
    logger.error("Auth middleware error:", error)
    res.status(401).json({ message: "Invalid token." })
  }
}
