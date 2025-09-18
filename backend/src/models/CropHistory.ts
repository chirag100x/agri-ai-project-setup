import mongoose, { type Document, Schema } from "mongoose"

export interface ICropHistory extends Document {
  userId: mongoose.Types.ObjectId
  season: string
  year: number
  crops: {
    name: string
    variety: string
    area: number
    plantingDate: Date
    harvestDate?: Date
    yield?: number
    quality?: "excellent" | "good" | "average" | "poor"
    issues?: string[]
  }[]
  weather: {
    rainfall: number
    temperature: {
      min: number
      max: number
      avg: number
    }
    humidity: number
  }
  inputs: {
    seeds: { type: string; quantity: number; cost: number }[]
    fertilizers: { type: string; quantity: number; cost: number }[]
    pesticides: { type: string; quantity: number; cost: number }[]
  }
  economics: {
    totalCost: number
    totalRevenue: number
    profit: number
    profitMargin: number
  }
  notes: string
  createdAt: Date
  updatedAt: Date
}

const CropHistorySchema = new Schema<ICropHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    season: {
      type: String,
      enum: ["kharif", "rabi", "zaid", "perennial"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: new Date().getFullYear() + 1,
    },
    crops: [
      {
        name: { type: String, required: true },
        variety: { type: String, required: true },
        area: { type: Number, required: true, min: 0 },
        plantingDate: { type: Date, required: true },
        harvestDate: Date,
        yield: { type: Number, min: 0 },
        quality: {
          type: String,
          enum: ["excellent", "good", "average", "poor"],
        },
        issues: [String],
      },
    ],
    weather: {
      rainfall: { type: Number, required: true, min: 0 },
      temperature: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        avg: { type: Number, required: true },
      },
      humidity: { type: Number, required: true, min: 0, max: 100 },
    },
    inputs: {
      seeds: [
        {
          type: { type: String, required: true },
          quantity: { type: Number, required: true, min: 0 },
          cost: { type: Number, required: true, min: 0 },
        },
      ],
      fertilizers: [
        {
          type: { type: String, required: true },
          quantity: { type: Number, required: true, min: 0 },
          cost: { type: Number, required: true, min: 0 },
        },
      ],
      pesticides: [
        {
          type: { type: String, required: true },
          quantity: { type: Number, required: true, min: 0 },
          cost: { type: Number, required: true, min: 0 },
        },
      ],
    },
    economics: {
      totalCost: { type: Number, required: true, min: 0 },
      totalRevenue: { type: Number, required: true, min: 0 },
      profit: { type: Number, required: true },
      profitMargin: { type: Number, required: true },
    },
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
CropHistorySchema.index({ userId: 1, year: -1, season: 1 })

export const CropHistory = mongoose.model<ICropHistory>("CropHistory", CropHistorySchema)
