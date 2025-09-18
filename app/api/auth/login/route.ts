import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock authentication logic
    // In a real app, you would validate against a database
    if (email === "demo@agri.ai" && password === "password") {
      const user = {
        id: "demo-user-1",
        email: "demo@agri.ai",
        name: "Demo User",
        location: "California, USA",
        farmSize: "medium",
        primaryCrop: "wheat",
      }

      return NextResponse.json({
        success: true,
        user,
        message: "Login successful",
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
