import { type NextRequest, NextResponse } from "next/server"
import { AIOrchestrator } from "@/lib/agents/ai-orchestrator"

export async function POST(request: NextRequest) {
  try {
    const { location, farmData } = await request.json()

    if (!location || !farmData) {
      return NextResponse.json({ error: "Location and farm data are required" }, { status: 400 })
    }

    const orchestrator = new AIOrchestrator()
    const insights = await orchestrator.getComprehensiveInsights(location, farmData)

    return NextResponse.json({
      success: true,
      insights,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in comprehensive insights API:", error)
    return NextResponse.json({ error: "Failed to get comprehensive insights" }, { status: 500 })
  }
}
