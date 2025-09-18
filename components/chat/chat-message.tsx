import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot, Leaf, CloudRain } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "recommendation" | "weather"
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  const getMessageIcon = () => {
    if (isUser) return <User className="h-4 w-4" />

    switch (message.type) {
      case "recommendation":
        return <Leaf className="h-4 w-4 text-secondary-foreground" />
      case "weather":
        return <CloudRain className="h-4 w-4 text-secondary-foreground" />
      default:
        return <Bot className="h-4 w-4 text-secondary-foreground" />
    }
  }

  const getMessageBadge = () => {
    if (isUser) return null

    switch (message.type) {
      case "recommendation":
        return (
          <Badge variant="secondary" className="text-xs">
            Crop Recommendation
          </Badge>
        )
      case "weather":
        return (
          <Badge variant="secondary" className="text-xs">
            Weather Insight
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-secondary")}>
        <AvatarFallback>{getMessageIcon()}</AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex flex-col items-end")}>
        {getMessageBadge()}
        <Card className={cn("mt-1", isUser && "bg-primary text-primary-foreground")}>
          <CardContent className="p-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <div
              className={cn("text-xs mt-2 opacity-70", isUser ? "text-primary-foreground" : "text-muted-foreground")}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
