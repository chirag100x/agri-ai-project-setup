"use client"

import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData extends LoginCredentials {
  name: string
  farmName?: string
  location?: string
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, logout, updateProfile } = useUser()
  const router = useRouter()

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      await login(credentials.email, credentials.password)
    },
    [login],
  )

  const signUp = useCallback(
    async (data: SignupData) => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          const user = await response.json()
          // Auto-login after successful signup
          await signIn({ email: data.email, password: data.password })
        } else {
          throw new Error(await response.text())
        }
      } catch (error) {
        throw error
      }
    },
    [signIn],
  )

  const signOut = useCallback(async () => {
    await logout()
    router.push("/auth/login")
  }, [logout, router])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/login")
      return false
    }
    return true
  }, [isAuthenticated, isLoading, router])

  const resetPassword = useCallback(async (email: string) => {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    requireAuth,
    resetPassword,
  }
}
