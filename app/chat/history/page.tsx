"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Leaf, Search, MessageCircle, Calendar, Filter } from "lucide-react"
import Link from "next/link"

interface ChatSession {
  id: string
  title: string
  preview: string
  timestamp: Date
  messageCount: number
  topics: string[]
}

const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Wheat Crop Planning",
    preview: "Discussed optimal planting time for wheat in northern regions...",
    timestamp: new Date(2024, 0, 15),
    messageCount: 12,
    topics: ["wheat", "planting", "weather"],
  },
  {
    id: "2",
    title: "Soil Analysis Help",
    preview: "Analyzed soil pH levels and nutrient deficiencies...",
    timestamp: new Date(2024, 0, 12),
    messageCount: 8,
    topics: ["soil", "nutrients", "fertilizer"],
  },
  {
    id: "3",
    title: "Pest Control Advice",
    preview: "Identified pest issues and recommended organic solutions...",
    timestamp: new Date(2024, 0, 10),
    messageCount: 15,
    topics: ["pests", "organic", "treatment"],
  },
]

export default function ChatHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sessions] = useState<ChatSession[]>(mockSessions)

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-secondary" />
            <span className="font-semibold text-foreground">AgriAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/chat">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Chat History</h1>
          <p className="text-muted-foreground">Review your previous conversations with AgriAI</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Chat Sessions */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription className="mt-1">{session.preview}</CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          {session.timestamp.toLocaleDateString()}
                        </div>
                        <div>{session.messageCount} messages</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {session.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/chat/${session.id}`}>
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No conversations found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start your first conversation with AgriAI"}
                </p>
                <Link href="/chat">
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
