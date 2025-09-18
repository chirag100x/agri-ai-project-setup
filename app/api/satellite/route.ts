import { type NextRequest, NextResponse } from "next/server"
import { satelliteAPI } from "@/lib/integrations/satellite-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const zoom = searchParams.get("zoom")

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 })
    }

    const satelliteData = await satelliteAPI.getSatelliteImage(
      Number.parseFloat(lat),
      Number.parseFloat(lon),
      zoom ? Number.parseInt(zoom) : 15,
    )

    return NextResponse.json(satelliteData)
  } catch (error) {
    console.error("Satellite API route error:", error)
    return NextResponse.json({ error: "Failed to fetch satellite data" }, { status: 500 })
  }
}
