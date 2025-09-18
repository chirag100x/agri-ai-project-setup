"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Leaf, Send, User, Bot } from "lucide-react"
import Link from "next/link"
import { ChatMessage } from "@/components/chat/chat-message"
import { VoiceRecorder } from "@/components/chat/voice-recorder"
import { LanguageSelector } from "@/components/chat/language-selector"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "recommendation" | "weather"
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AgriAI assistant. I can help you with crop recommendations, weather insights, soil analysis, and farming guidance. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(userMessage.content),
        role: "assistant",
        timestamp: new Date(),
        type: determineResponseType(userMessage.content),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("crop") || input.includes("plant") || input.includes("grow")) {
      return "Based on your location and soil conditions, I recommend considering crops like wheat, corn, or soybeans for this season. These crops are well-suited to your climate zone and current market conditions show good demand. Would you like specific planting guidelines for any of these crops?"
    }

    if (input.includes("weather") || input.includes("rain") || input.includes("temperature")) {
      return "Current weather conditions show partly cloudy skies with temperatures ranging from 18-25°C. There's a 30% chance of light rain in the next 3 days, which would be beneficial for recently planted crops. The 7-day forecast indicates stable conditions ideal for field work."
    }

    if (input.includes("soil") || input.includes("fertilizer") || input.includes("nutrient")) {
      return "Your soil analysis indicates good organic matter content with slightly low nitrogen levels. I recommend applying a balanced NPK fertilizer (10-10-10) at a rate of 200kg per hectare before planting. Consider adding compost to improve soil structure and water retention."
    }

    return "I understand you're asking about farming practices. Could you provide more specific details about your crop type, location, or the particular challenge you're facing? This will help me give you more targeted advice."
  }

  const determineResponseType = (userInput: string): "text" | "recommendation" | "weather" => {
    const input = userInput.toLowerCase()
    if (input.includes("crop") || input.includes("plant") || input.includes("recommend")) {
      return "recommendation"
    }
    if (input.includes("weather") || input.includes("rain") || input.includes("temperature")) {
      return "weather"
    }
    return "text"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript)
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-secondary" />
            <span className="font-semibold text-foreground">AgriAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-secondary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-secondary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-sm">AgriAI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about crops, weather, soil, or farming practices..."
                className="pr-12 min-h-[44px] resize-none"
                disabled={isLoading}
              />
              <VoiceRecorder
                isRecording={isRecording}
                onStartRecording={() => setIsRecording(true)}
                onStopRecording={() => setIsRecording(false)}
                onTranscript={handleVoiceInput}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="h-[44px] px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center mt-2">
            AgriAI can make mistakes. Please verify important farming decisions with local experts.
          </div>
        </div>
      </div>
    </div>
  )
}
