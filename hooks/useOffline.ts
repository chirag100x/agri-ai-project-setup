"use client"

import { useState, useEffect, useCallback } from "react"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        // Trigger sync or refresh when coming back online
        window.dispatchEvent(new CustomEvent("app:back-online"))
      }
      setWasOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      // Trigger offline mode
      window.dispatchEvent(new CustomEvent("app:offline"))
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [wasOffline])

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
      })
      return response.ok
    } catch {
      return false
    }
  }, [])

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    checkConnection,
  }
}
