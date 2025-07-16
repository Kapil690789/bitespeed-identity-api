import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import contactRoutes from "./routes/contactRoutes"

dotenv.config()

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check - CRITICAL for Render
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 3000
  })
})

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Bitespeed Identity Reconciliation API",
    version: "1.0.0",
    status: "running"
  })
})

// API routes
app.use("/", contactRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  })
})

// Error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", error)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  })
})

export default app