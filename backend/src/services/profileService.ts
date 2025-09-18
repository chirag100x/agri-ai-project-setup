import { User } from "../models/User"
import { Profile } from "../models/Profile"
import logger from "../utils/logger"

export interface ProfileUpdateData {
  name?: string
  farmLocation?: string
  farmSize?: number
  primaryCrop?: string
  language?: string
  units?: "metric" | "imperial"
  notifications?: {
    weather?: boolean
    crops?: boolean
    market?: boolean
  }
}

export class ProfileService {
  async getProfile(userId: string) {
    try {
      const user = await User.findById(userId).select("-password")
      const profile = await Profile.findOne({ userId })

      if (!user) {
        throw new Error("User not found")
      }

      return {
        user,
        profile: profile || this.createDefaultProfile(userId),
      }
    } catch (error) {
      logger.error("Get profile error:", error)
      throw error
    }
  }

  async updateProfile(userId: string, updateData: ProfileUpdateData) {
    try {
      // Update user basic info
      const user = await User.findByIdAndUpdate(
        userId,
        {
          name: updateData.name,
          farmLocation: updateData.farmLocation,
          farmSize: updateData.farmSize,
          primaryCrop: updateData.primaryCrop,
        },
        { new: true, runValidators: true },
      ).select("-password")

      if (!user) {
        throw new Error("User not found")
      }

      // Update or create profile
      let profile = await Profile.findOne({ userId })
      if (!profile) {
        profile = new Profile({
          userId,
          language: updateData.language || "en",
          units: updateData.units || "metric",
          notifications: updateData.notifications || {
            weather: true,
            crops: true,
            market: false,
          },
        })
      } else {
        profile.language = updateData.language || profile.language
        profile.units = updateData.units || profile.units
        profile.notifications = { ...profile.notifications, ...updateData.notifications }
      }

      await profile.save()

      logger.info(`Profile updated for user: ${userId}`)

      return { user, profile }
    } catch (error) {
      logger.error("Update profile error:", error)
      throw error
    }
  }

  async uploadAvatar(userId: string, avatarData: Buffer): Promise<string> {
    try {
      // In a real implementation, you would upload to cloud storage
      // For now, just return a placeholder URL
      const avatarUrl = `/uploads/avatars/${userId}.jpg`

      // Update user with avatar URL
      await User.findByIdAndUpdate(userId, { avatar: avatarUrl })

      logger.info(`Avatar uploaded for user: ${userId}`)
      return avatarUrl
    } catch (error) {
      logger.error("Upload avatar error:", error)
      throw error
    }
  }

  private createDefaultProfile(userId: string) {
    return {
      userId,
      language: "en",
      units: "metric",
      notifications: {
        weather: true,
        crops: true,
        market: false,
      },
    }
  }
}

export const profileService = new ProfileService()
