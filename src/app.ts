import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes";
import path from "path";

dotenv.config();

const app = express();

// --- Middleware ---

// THIS IS THE FIX: Configure Helmet's Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://cdn.tailwindcss.com"], // Allows scripts from our server and the Tailwind CDN
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allows inline styles and fonts
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Serve Static UI ---
// This serves your index.html and script.js files.
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---
app.use("/", contactRoutes);

// --- Error Handling ---
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!res.headersSent) {
    res.status(404).json({
      error: "Not Found",
      message: `API endpoint not found: ${req.method} ${req.path}`,
    });
  }
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", error);
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred.",
  });
});

export default app;
