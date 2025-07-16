import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log("✅ Prisma connected to database")
  })
  .catch((error) => {
    console.error("❌ Prisma connection failed:", error)
  })

export default prisma