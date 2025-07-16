import app from "./app"
import prisma from "./config/database"

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected successfully")
    
    // CRITICAL: Bind to 0.0.0.0 for Render deployment
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`📍 API endpoint: http://localhost:${PORT}/identify`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

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

startServer()