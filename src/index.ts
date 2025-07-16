import app from "./app"
import prisma from "./config/database"

const PORT: number = parseInt(process.env.PORT || '3000', 10)

async function startServer(): Promise<void> {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connected successfully")
    
    // CRITICAL: Must bind to 0.0.0.0 for Render
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
      console.log(`📍 Health check: http://0.0.0.0:${PORT}/health`)
      console.log(`📍 API endpoint: http://0.0.0.0:${PORT}/identify`)
    })

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`)
      } else {
        console.error('❌ Server error:', error)
      }
      process.exit(1)
    })

  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown handlers
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...")
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down server...")
  await prisma.$disconnect()
  process.exit(0)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

startServer()
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  startServer()
}