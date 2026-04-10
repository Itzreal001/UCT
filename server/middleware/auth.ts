import { Request, Response, NextFunction } from "express";
import { tokenAuth } from "../lib/tokens.ts";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header required" });
    return;
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = tokenAuth.verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}