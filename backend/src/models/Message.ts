import mongoose, { type Document, Schema } from "mongoose"

export interface IMessage extends Document {
  userId: mongoose.Types.ObjectId
  sessionId: string
  type: "user" | "assistant" | "system"
  content: string
  metadata: {
    language: string
    context?: string
    confidence?: number
    sources?: string[]
  }
  attachments?: {
    type: "image" | "audio" | "file"
    url: string
    filename: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      language: {
        type: String,
        required: true,
        default: "en",
      },
      context: String,
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      sources: [String],
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "audio", "file"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
MessageSchema.index({ userId: 1, sessionId: 1, createdAt: -1 })

export const Message = mongoose.model<IMessage>("Message", MessageSchema)
