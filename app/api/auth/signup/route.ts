import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, location, farmSize, primaryCrop } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Mock user creation logic
    // In a real app, you would save to a database
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      location: location || "",
      farmSize: farmSize || "",
      primaryCrop: primaryCrop || "",
    }

    return NextResponse.json({
      success: true,
      user,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
