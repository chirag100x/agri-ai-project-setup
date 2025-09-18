interface StorageItem<T> {
  value: T
  timestamp: number
  expiresAt?: number
}

class Storage {
  private prefix: string

  constructor(prefix = "agri-ai") {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  private isExpired(item: StorageItem<any>): boolean {
    if (!item.expiresAt) return false
    return Date.now() > item.expiresAt
  }

  // Local Storage methods
  setLocal<T>(key: string, value: T, expiresInMs?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined,
      }
      localStorage.setItem(this.getKey(key), JSON.stringify(item))
    } catch (error) {
      console.warn("Failed to save to localStorage:", error)
    }
  }

  getLocal<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key))
      if (!stored) return null

      const item: StorageItem<T> = JSON.parse(stored)

      if (this.isExpired(item)) {
        this.removeLocal(key)
        return null
      }

      return item.value
    } catch (error) {
      console.warn("Failed to read from localStorage:", error)
      return null
    }
  }

  removeLocal(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error)
    }
  }

  clearLocal(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn("Failed to clear localStorage:", error)
    }
  }

  // Session Storage methods
  setSession<T>(key: string, value: T): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(this.getKey(key), JSON.stringify(item))
    } catch (error) {
      console.warn("Failed to save to sessionStorage:", error)
    }
  }

  getSession<T>(key: string): T | null {
    try {
      const stored = sessionStorage.getItem(this.getKey(key))
      if (!stored) return null

      const item: StorageItem<T> = JSON.parse(stored)
      return item.value
    } catch (error) {
      console.warn("Failed to read from sessionStorage:", error)
      return null
    }
  }

  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.warn("Failed to remove from sessionStorage:", error)
    }
  }

  clearSession(): void {
    try {
      const keys = Object.keys(sessionStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn("Failed to clear sessionStorage:", error)
    }
  }

  // Cache management for offline functionality
  setCachedData<T>(key: string, data: T, cacheTimeMs = 300000): void {
    this.setLocal(key, data, cacheTimeMs)
  }

  getCachedData<T>(key: string): T | null {
    return this.getLocal<T>(key)
  }

  // Offline queue management
  addToOfflineQueue(action: any): void {
    const queue = this.getLocal<any[]>("offline-queue") || []
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: Date.now().toString(),
    })
    this.setLocal("offline-queue", queue)
  }

  getOfflineQueue(): any[] {
    return this.getLocal<any[]>("offline-queue") || []
  }

  removeFromOfflineQueue(actionId: string): void {
    const queue = this.getOfflineQueue()
    const filtered = queue.filter((action) => action.id !== actionId)
    this.setLocal("offline-queue", filtered)
  }

  clearOfflineQueue(): void {
    this.removeLocal("offline-queue")
  }
}

// Create and export default instance
export const storage = new Storage()

// Export class for custom instances
export { Storage }

// Specific storage utilities for AgriAI
export const agriStorage = {
  // User preferences
  saveUserPreferences: (preferences: any) => storage.setLocal("user-preferences", preferences),
  getUserPreferences: () => storage.getLocal("user-preferences"),

  // Chat history for offline access
  saveChatHistory: (history: any[]) => storage.setLocal("chat-history", history, 24 * 60 * 60 * 1000), // 24 hours
  getChatHistory: () => storage.getLocal("chat-history"),

  // Weather data cache
  cacheWeatherData: (location: string, data: any) => storage.setCachedData(`weather-${location}`, data, 30 * 60 * 1000), // 30 minutes
  getCachedWeatherData: (location: string) => storage.getCachedData(`weather-${location}`),

  // Crop recommendations cache
  cacheCropRecommendations: (params: string, data: any) =>
    storage.setCachedData(`crops-${params}`, data, 60 * 60 * 1000), // 1 hour
  getCachedCropRecommendations: (params: string) => storage.getCachedData(`crops-${params}`),

  // Offline functionality
  addOfflineAction: (action: any) => storage.addToOfflineQueue(action),
  getOfflineActions: () => storage.getOfflineQueue(),
  removeOfflineAction: (id: string) => storage.removeFromOfflineQueue(id),
  clearOfflineActions: () => storage.clearOfflineQueue(),
}
