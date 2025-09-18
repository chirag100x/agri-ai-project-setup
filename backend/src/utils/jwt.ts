import jwt from "jsonwebtoken"
import { logger } from "./logger"

export interface JWTPayload {
  userId: string
  email?: string
}

export class JWTUtil {
  private static secret = process.env.JWT_SECRET || "fallback-secret-key"
  private static refreshSecret = process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret"

  static generateToken(payload: JWTPayload, expiresIn = "1h"): string {
    try {
      return jwt.sign(payload, this.secret, { expiresIn })
    } catch (error) {
      logger.error("JWT generation error:", error)
      throw new Error("Token generation failed")
    }
  }

  static generateRefreshToken(payload: JWTPayload): string {
    try {
      return jwt.sign(payload, this.refreshSecret, { expiresIn: "7d" })
    } catch (error) {
      logger.error("Refresh token generation error:", error)
      throw new Error("Refresh token generation failed")
    }
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload
    } catch (error) {
      logger.error("JWT verification error:", error)
      throw new Error("Invalid token")
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as JWTPayload
    } catch (error) {
      logger.error("Refresh token verification error:", error)
      throw new Error("Invalid refresh token")
    }
  }
}
