import type { Request, Response, NextFunction } from "express"
import { profileService } from "../services/profileService"
import { validationResult } from "express-validator"

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const profile = await profileService.getProfile(userId)

      res.json({
        success: true,
        data: profile,
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user?.id
      const updateData = req.body

      const updatedProfile = await profileService.updateProfile(userId, updateData)

      res.json({
        success: true,
        data: updatedProfile,
      })
    } catch (error) {
      next(error)
    }
  }

  static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const file = req.file

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const avatarUrl = await profileService.uploadAvatar(userId, file)

      res.json({
        success: true,
        data: { avatarUrl },
      })
    } catch (error) {
      next(error)
    }
  }
}
