interface ApiClientConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private retries: number
  private retryDelay: number

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_URL || ""
    this.timeout = config.timeout || 10000
    this.retries = config.retries || 3
    this.retryDelay = config.retryDelay || 1000
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { timeout = this.timeout, retries = this.retries, ...requestConfig } = config

    const url = `${this.baseURL}${endpoint}`

    // Add default headers
    const headers = {
      "Content-Type": "application/json",
      ...requestConfig.headers,
    }

    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          url,
          {
            ...requestConfig,
            headers,
          },
          timeout,
        )

        if (!response.ok) {
          throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status, response)
        }

        // Handle different content types
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("application/json")) {
          return await response.json()
        } else if (contentType?.includes("text/")) {
          return (await response.text()) as T
        } else {
          return (await response.blob()) as T
        }
      } catch (error) {
        lastError = error as Error

        // Don't retry on client errors (4xx) except 408, 429
        if (error instanceof ApiError) {
          const shouldRetry = error.status === 408 || error.status === 429 || error.status >= 500
          if (!shouldRetry || attempt === retries) {
            throw error
          }
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          throw error
        }

        // Wait before retrying with exponential backoff
        await this.delay(this.retryDelay * Math.pow(2, attempt))
      }
    }

    throw lastError!
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }
}

// Create and export a default instance
export const apiClient = new ApiClient()

// Export the class for custom instances
export { ApiClient, ApiError }

// Typed API methods for AgriAI specific endpoints
export const agriApi = {
  // Weather endpoints
  weather: {
    getCurrent: (location: string) => apiClient.get<any>(`/api/weather?location=${encodeURIComponent(location)}`),
    getForecast: (location: string, days = 7) =>
      apiClient.get<any>(`/api/weather/forecast?location=${encodeURIComponent(location)}&days=${days}`),
  },

  // Soil endpoints
  soil: {
    getAnalysis: (location: string) => apiClient.get<any>(`/api/soil?location=${encodeURIComponent(location)}`),
    getRecommendations: (soilData: any) => apiClient.post<any>("/api/soil/recommendations", soilData),
  },

  // Crop endpoints
  crops: {
    getRecommendations: (params: any) => apiClient.post<any>("/api/crops/recommendations", params),
    getCropInfo: (cropId: string) => apiClient.get<any>(`/api/crops/${cropId}`),
  },

  // Chat endpoints
  chat: {
    sendMessage: (message: string, sessionId?: string) => apiClient.post<any>("/api/chat", { message, sessionId }),
    getSessions: () => apiClient.get<any>("/api/chat/sessions"),
    getSession: (sessionId: string) => apiClient.get<any>(`/api/chat/sessions/${sessionId}`),
  },
}
