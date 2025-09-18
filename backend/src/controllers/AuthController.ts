import type { Request, Response, NextFunction } from "express"
import { authService } from "../services/authService"
import { validationResult } from "express-validator"

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, name, farmSize, primaryCrop } = req.body

      const result = await authService.register({
        email,
        password,
        name,
        farmSize,
        primaryCrop,
      })

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      const result = await authService.login(email, password)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body

      const result = await authService.refreshToken(refreshToken)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      await authService.logout(refreshToken)

      res.json({
        success: true,
        message: "Logged out successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}
