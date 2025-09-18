import app from "./app"
import { logger } from "./utils/logger"
import mongoose from "mongoose"
import { cache } from "./utils/cache"

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/agri-ai"

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    logger.info("Connected to MongoDB")

    // Connect to Redis cache
    await cache.connect()

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
