"use client"

import { useState, useEffect } from "react"

interface WeatherData {
  location: string
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    uvIndex: number
  }
  forecast: Array<{
    date: string
    high: number
    low: number
    condition: string
    precipitation: number
  }>
  alerts?: Array<{
    type: string
    message: string
    severity: "low" | "medium" | "high"
  }>
}

export function useWeather(lat?: number, lon?: number, city?: string) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lat && !lon && !city) return

    const fetchWeather = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (lat && lon) {
          params.append("lat", lat.toString())
          params.append("lon", lon.toString())
        } else if (city) {
          params.append("city", city)
        }

        const response = await fetch(`/api/weather?${params}`)
        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const weatherData = await response.json()
        setData(weatherData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [lat, lon, city])

  return {
    data,
    loading,
    error,
    refetch: () => {
      if (lat && lon) {
        // Trigger refetch
      }
    },
  }
}
