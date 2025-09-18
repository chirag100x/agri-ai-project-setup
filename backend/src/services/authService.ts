import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { logger } from "../utils/logger"

export class AuthService {
  async register(userData: {
    email: string
    password: string
    name: string
  }) {
    try {
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new Error("User already exists")
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12)

      const user = new User({
        ...userData,
        password: hashedPassword,
      })

      await user.save()

      const token = this.generateToken(user._id.toString())

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    } catch (error) {
      logger.error("Registration error:", error)
      throw error
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error("Invalid credentials")
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error("Invalid credentials")
      }

      const token = this.generateToken(user._id.toString())

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    } catch (error) {
      logger.error("Login error:", error)
      throw error
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })
  }
}

export const authService = new AuthService()
