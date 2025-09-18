import { type NextRequest, NextResponse } from "next/server"
import { soilAPI } from "@/lib/integrations/soil-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 })
    }

    const soilData = await soilAPI.getSoilData(Number.parseFloat(lat), Number.parseFloat(lon))
    return NextResponse.json(soilData)
  } catch (error) {
    console.error("Soil API route error:", error)
    return NextResponse.json({ error: "Failed to fetch soil data" }, { status: 500 })
  }
}
