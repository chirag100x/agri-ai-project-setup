import { type NextRequest, NextResponse } from "next/server"
import { AIOrchestrator } from "@/lib/agents/ai-orchestrator"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const orchestrator = new AIOrchestrator()
    const response = await orchestrator.processNaturalLanguageQuery(query)

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in query API:", error)
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 })
  }
}
