"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  farmName?: string
  location?: string
  farmSize?: number
  primaryCrop?: string
  avatar?: string
  preferences: {
    units: "metric" | "imperial"
    notifications: boolean
    theme: "light" | "dark" | "system"
  }
}

interface UserState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

type UserAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<User["preferences"]> }

interface UserContextType extends UserState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  updatePreferences: (preferences: Partial<User["preferences"]>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case "UPDATE_PREFERENCES":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              preferences: { ...state.user.preferences, ...action.payload },
            }
          : null,
      }
    default:
      return state
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const user = await response.json()
        dispatch({ type: "SET_USER", payload: user })
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to check authentication status" })
    }
  }

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const user = await response.json()
        dispatch({ type: "SET_USER", payload: user })
      } else {
        const error = await response.text()
        dispatch({ type: "SET_ERROR", payload: error })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Login failed" })
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      dispatch({ type: "LOGOUT" })
    } catch (error) {
      dispatch({ type: "LOGOUT" })
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        dispatch({ type: "SET_USER", payload: updatedUser })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update profile" })
    }
  }

  const updatePreferences = (preferences: Partial<User["preferences"]>) => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: preferences })
  }

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
