import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/users.ts";
import storageRoutes from "./routes/storage.ts";
import realtimeRoutes from "./routes/realtime.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== "production";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: isDev ? false : {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
        },
      },
    })
  );

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!isDev) {
          // Production: check against APP_URL
          const appUrl = process.env.APP_URL;
          if (origin === appUrl) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        } else {
          // Development: allow localhost on any port, or no origin (for same-origin or tools like Postman)
          if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        }
      },
      credentials: true,
    })
  );

  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later" },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: "Too many auth attempts, please try again later" },
  });

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API Routes
  app.use("/api", apiLimiter);
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/storage", storageRoutes);
  app.use("/api/realtime", realtimeRoutes);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Static files
  const staticPath = path.resolve(__dirname, "public");
  app.use(express.static(staticPath));

  // SPA fallback - must come after API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (isDev) {
      console.log(`API: http://localhost:${port}/api`);
      console.log(`Frontend dev server: http://localhost:3000`);
    }
  });
}

startServer().catch(console.error);
