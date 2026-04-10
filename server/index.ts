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

// 🎯 Parse allowed origins from env var (comma-separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

async function startServer() {
  const app = express();
  const server = createServer(app);

  // 🔐 Security headers
  app.use(
    helmet({
      contentSecurityPolicy: isDev
        ? false
        : {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
              connectSrc: [
                "'self'",
                "https:", // Allow API calls to any HTTPS origin (adjust for prod)
              ],
            },
          },
    })
  );

  // 🌐 CORS - Flexible for Vercel + Railway + Localhost
  app.use(
    cors({
      origin: (origin, callback) => {
        // ✅ Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // ✅ Always allow localhost in any environment (for testing)
        if (
          origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:")
        ) {
          return callback(null, true);
        }

        // ✅ Check against explicit allowed origins from env
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // ✅ Allow Vercel preview deployments (*.vercel.app)
        if (origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }

        // ✅ Allow Railway/Render/Fly.io domains in production
        if (
          origin.endsWith(".up.railway.app") ||
          origin.endsWith(".onrender.com") ||
          origin.endsWith(".fly.dev")
        ) {
          return callback(null, true);
        }

        // ❌ Block everything else
        console.warn(`🚫 CORS blocked: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // 🚦 Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // stricter for auth endpoints
    message: { error: "Too many auth attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // 📦 Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 🗂️ API Routes
  app.use("/api", apiLimiter);
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/storage", storageRoutes);
  app.use("/api/realtime", realtimeRoutes);

  // 💓 Health check (for Render/Railway uptime monitoring)
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 📁 Serve static frontend files (Vite build output)
  const staticPath = path.resolve(__dirname, "public");
  app.use(express.static(staticPath));

  // 🔄 SPA fallback: send index.html for all non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // 🚀 Start server
  const port = parseInt(process.env.PORT || "3001", 10);

  server.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${port}`);
    if (isDev) {
      console.log(`🔗 API: http://localhost:${port}/api`);
      console.log(`🎨 Frontend: http://localhost:3000`);
    }
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});