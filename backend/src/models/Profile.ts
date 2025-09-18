import mongoose, { type Document, Schema } from "mongoose"

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId
  farmDetails: {
    size: number
    soilType: string
    irrigationType: string
    crops: string[]
  }
  preferences: {
    language: string
    units: "metric" | "imperial"
    notifications: {
      weather: boolean
      crops: boolean
      market: boolean
    }
  }
  statistics: {
    totalChats: number
    totalRecommendations: number
    lastActive: Date
  }
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    farmDetails: {
      size: {
        type: Number,
        required: true,
        min: 0,
      },
      soilType: {
        type: String,
        enum: ["clay", "sandy", "loamy", "silt", "peat", "chalk"],
        required: true,
      },
      irrigationType: {
        type: String,
        enum: ["drip", "sprinkler", "flood", "furrow", "none"],
        required: true,
      },
      crops: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    preferences: {
      language: {
        type: String,
        default: "en",
        enum: ["en", "hi", "te", "ta", "kn", "ml", "gu", "mr", "bn", "pa"],
      },
      units: {
        type: String,
        enum: ["metric", "imperial"],
        default: "metric",
      },
      notifications: {
        weather: { type: Boolean, default: true },
        crops: { type: Boolean, default: true },
        market: { type: Boolean, default: false },
      },
    },
    statistics: {
      totalChats: { type: Number, default: 0 },
      totalRecommendations: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  },
)

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema)
