import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { logger } from "../utils/logger"

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  farmLocation?: string
  farmSize?: number
  primaryCrop?: string
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret"
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d"

  async register(userData: RegisterData): Promise<{ user: any; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
      })

      await user.save()

      // Generate tokens
      const tokens = this.generateTokens(user._id.toString())

      logger.info(`User registered successfully: ${userData.email}`)

      return {
        user: this.sanitizeUser(user),
        tokens,
      }
    } catch (error) {
      logger.error("Registration error:", error)
      throw error
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: any; tokens: AuthTokens }> {
    try {
      // Find user
      const user = await User.findOne({ email: credentials.email })
      if (!user) {
        throw new Error("Invalid credentials")
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
      if (!isPasswordValid) {
        throw new Error("Invalid credentials")
      }

      // Generate tokens
      const tokens = this.generateTokens(user._id.toString())

      logger.info(`User logged in successfully: ${credentials.email}`)

      return {
        user: this.sanitizeUser(user),
        tokens,
      }
    } catch (error) {
      logger.error("Login error:", error)
      throw error
    }
  }

  private generateTokens(userId: string): AuthTokens {
    const accessToken = jwt.sign({ userId, type: "access" }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN })

    const refreshToken = jwt.sign({ userId, type: "refresh" }, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    })

    return { accessToken, refreshToken }
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user.toObject()
    return sanitizedUser
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET)
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
}

export const authService = new AuthService()
