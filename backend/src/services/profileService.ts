import { Profile } from "../models/Profile"
import { logger } from "../utils/logger"

export class ProfileService {
  async getProfile(userId: string) {
    try {
      const profile = await Profile.findOne({ userId })
      return profile
    } catch (error) {
      logger.error("Get profile error:", error)
      throw error
    }
  }

  async updateProfile(userId: string, profileData: any) {
    try {
      const profile = await Profile.findOneAndUpdate({ userId }, profileData, { new: true, upsert: true })
      return profile
    } catch (error) {
      logger.error("Update profile error:", error)
      throw error
    }
  }
}

export const profileService = new ProfileService()
