import { type NextRequest, NextResponse } from "next/server"
import { weatherAPI } from "@/lib/integrations/weather-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const city = searchParams.get("city")

    let weatherData

    if (lat && lon) {
      weatherData = await weatherAPI.getCurrentWeather(Number.parseFloat(lat), Number.parseFloat(lon))
    } else if (city) {
      weatherData = await weatherAPI.getWeatherByCity(city)
    } else {
      return NextResponse.json({ error: "Location parameters required" }, { status: 400 })
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API route error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
