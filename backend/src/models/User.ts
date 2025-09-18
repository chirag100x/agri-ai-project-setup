import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  name: string
  farmSize?: number
  primaryCrop?: string
  location?: {
    lat: number
    lon: number
    address: string
  }
  avatar?: string
  language: string
  isVerified: boolean
  refreshTokens: string[]
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    farmSize: {
      type: Number,
      min: 0,
    },
    primaryCrop: {
      type: String,
      trim: true,
    },
    location: {
      lat: { type: Number },
      lon: { type: Number },
      address: { type: String, trim: true },
    },
    avatar: {
      type: String,
    },
    language: {
      type: String,
      default: "en",
      enum: ["en", "hi", "te", "ta", "kn", "ml", "gu", "mr", "bn", "pa"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for geospatial queries
UserSchema.index({ "location.lat": 1, "location.lon": 1 })

export const User = mongoose.model<IUser>("User", UserSchema)
