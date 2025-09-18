import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Leaf, CloudRain, Globe, BarChart3, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-secondary" />
              <h1 className="text-2xl font-bold text-foreground">AgriAI</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Your AI-Powered Agricultural Assistant
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Get personalized crop recommendations, real-time weather insights, and expert farming guidance powered by
            advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chatting
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Powerful Features for Modern Farming</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Leaf className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Crop Recommendations</CardTitle>
                <CardDescription>
                  Get AI-powered suggestions for optimal crop selection based on your soil, climate, and market
                  conditions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CloudRain className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Weather Intelligence</CardTitle>
                <CardDescription>
                  Access real-time weather data and forecasts tailored to your farming location and crop needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>
                  Communicate in your preferred language with support for multiple regional languages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Soil Analysis</CardTitle>
                <CardDescription>
                  Integrate with SoilGrids data to understand your soil composition and nutrient levels.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>24/7 AI Assistant</CardTitle>
                <CardDescription>
                  Get instant answers to your farming questions anytime with our intelligent chatbot.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Expert Network</CardTitle>
                <CardDescription>
                  Connect with agricultural experts and fellow farmers in your region for knowledge sharing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Ready to Transform Your Farming?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgriAI to make smarter farming decisions.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-secondary" />
            <span className="text-lg font-semibold text-foreground">AgriAI</span>
          </div>
          <p className="text-muted-foreground">Empowering farmers with AI technology.</p>
        </div>
      </footer>
    </div>
  )
}
