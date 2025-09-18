"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useAuth } from "./useAuth"

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "weather" | "crop_recommendation" | "soil_analysis"
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export function useChat(sessionId?: string) {
  const { user, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load chat session on mount
  useEffect(() => {
    if (sessionId && isAuthenticated) {
      loadChatSession(sessionId)
    }
  }, [sessionId, isAuthenticated])

  const loadChatSession = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${id}`)
      if (response.ok) {
        const session = await response.json()
        setCurrentSession(session)
        setMessages(session.messages)
      }
    } catch (error) {
      setError("Failed to load chat session")
    }
  }, [])

  const sendMessage = useCallback(
    async (content: string, type: "text" | "voice" = "text") => {
      if (!content.trim() || isLoading) return

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date(),
        type,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        abortControllerRef.current = new AbortController()

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId: currentSession?.id,
            context: {
              location: user?.location,
              primaryCrop: user?.primaryCrop,
              farmSize: user?.farmSize,
            },
          }),
          signal: abortControllerRef.current.signal,
        })

        if (response.ok) {
          const data = await response.json()
          const assistantMessage: ChatMessage = {
            id: data.id || Date.now().toString(),
            content: data.content,
            role: "assistant",
            timestamp: new Date(),
            type: data.type || "text",
            metadata: data.metadata,
          }

          setMessages((prev) => [...prev, assistantMessage])

          // Update session if provided
          if (data.sessionId) {
            setCurrentSession((prev) =>
              prev
                ? {
                    ...prev,
                    id: data.sessionId,
                    updatedAt: new Date(),
                  }
                : null,
            )
          }
        } else {
          throw new Error(await response.text())
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError("Failed to send message")
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [isLoading, currentSession, user],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setCurrentSession(null)
    setError(null)
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }, [])

  const regenerateResponse = useCallback(
    async (messageId: string) => {
      const messageIndex = messages.findIndex((msg) => msg.id === messageId)
      if (messageIndex === -1) return

      const userMessage = messages[messageIndex - 1]
      if (userMessage?.role === "user") {
        // Remove the assistant message and regenerate
        setMessages((prev) => prev.slice(0, messageIndex))
        await sendMessage(userMessage.content)
      }
    },
    [messages, sendMessage],
  )

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    isLoading,
    error,
    currentSession,
    sendMessage,
    clearMessages,
    deleteMessage,
    regenerateResponse,
    stopGeneration,
    loadChatSession,
  }
}
