import { type NextRequest, NextResponse } from "next/server"
import { aiChatService } from "@/lib/integrations/ai-chat"

export async function POST(request: NextRequest) {
  try {
    const { messages, userContext } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 })
    }

    const response = await aiChatService.generateResponse(messages, userContext)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat API route error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
