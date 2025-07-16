import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import contactRoutes from "./routes/contactRoutes"

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/", contactRoutes)

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  })
})

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", error)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  })
})

export default app
