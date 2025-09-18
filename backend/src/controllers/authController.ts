import type { Request, Response, NextFunction } from "express"
import { authService } from "../services/authService"
import { validationResult } from "express-validator"

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, name, farmSize, primaryCrop, location } = req.body

    const result = await authService.register({
      email,
      password,
      name,
      farmSize,
      primaryCrop,
      location,
    })

    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
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

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
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

export const logout = async (req: Request, res: Response, next: NextFunction) => {
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
