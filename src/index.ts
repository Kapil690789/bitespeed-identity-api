import app from "./app"
import prisma from "./config/database"

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`📍 API endpoint: http://localhost:${PORT}/identify`)
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

startServer()
