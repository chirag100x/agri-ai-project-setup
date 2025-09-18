import { FarmingDashboard } from "@/components/dashboard/farming-dashboard"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-secondary" />
            <span className="font-semibold text-foreground">AgriAI Dashboard</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground">
              Chat
            </Link>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farm Dashboard</h1>
          <p className="text-muted-foreground">Monitor your farm's health, weather, and activities in one place</p>
        </div>

        <FarmingDashboard />
      </main>
    </div>
  )
}
