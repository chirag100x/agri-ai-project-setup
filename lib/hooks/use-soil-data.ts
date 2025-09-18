"use client"

import { useState, useEffect } from "react"

interface SoilData {
  location: string
  testDate: string
  ph: {
    value: number
    status: "low" | "optimal" | "high"
    recommendation: string
  }
  nutrients: {
    nitrogen: { value: number; status: "low" | "medium" | "high"; unit: string }
    phosphorus: { value: number; status: "low" | "medium" | "high"; unit: string }
    potassium: { value: number; status: "low" | "medium" | "high"; unit: string }
  }
  organicMatter: {
    value: number
    status: "low" | "medium" | "high"
    unit: string
  }
  moisture: {
    value: number
    status: "low" | "optimal" | "high"
    unit: string
  }
  recommendations: string[]
}

export function useSoilData(lat?: number, lon?: number) {
  const [data, setData] = useState<SoilData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lat || !lon) return

    const fetchSoilData = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
        })

        const response = await fetch(`/api/soil?${params}`)
        if (!response.ok) {
          throw new Error("Failed to fetch soil data")
        }

        const soilData = await response.json()
        setData(soilData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchSoilData()
  }, [lat, lon])

  return { data, loading, error }
}
