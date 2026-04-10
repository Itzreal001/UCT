import express, { Router, type Request, type Response } from "express";
import { db } from "../lib/db.ts";
import { tokenAuth } from "../lib/tokens.ts";
import { requireAuth, type AuthRequest } from "../middleware/auth.ts";

const router = Router();

/**
 * POST /api/auth/register
 * Creates a user with simple email/password authentication.
 * Note: Any password is accepted for demo purposes.
 */
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, username } = req.body;

  if (!email || !password || !firstName || !lastName || !username) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const isAvailable = await db.checkUsernameAvailable(username);
    if (!isAvailable) {
      res.status(409).json({ error: "Username is already taken" });
      return;
    }

    const uid = await db.createUser({
      email,
      password,
      firstName,
      lastName,
      username,
    });

    // Generate token for immediate login
    const token = tokenAuth.generateToken(uid, email);

    res.status(201).json({
      message: "Account created successfully",
      uid,
      token,
    });
  } catch (err: any) {
    if (err.message === "Email already exists") {
      res.status(409).json({ error: "Email is already in use" });
      return;
    }
    if (err.message === "Username already taken") {
      res.status(409).json({ error: "Username is already taken" });
      return;
    }
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

/**
 * POST /api/auth/login
 * Simple login with email and password (any password works for demo).
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const uid = await db.verifyCredentials(email, password);

    if (!uid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = tokenAuth.generateToken(uid, email);

    res.json({
      message: "Login successful",
      uid,
      token,
      email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/**
 * POST /api/auth/verify
 * Verifies a token (called by client after sign-in).
 */
router.post("/verify", async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ error: "idToken is required" });
    return;
  }

  try {
    const decoded = tokenAuth.verifyToken(idToken);

    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const user = await db.getUserById(decoded.uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      uid: decoded.uid,
      email: decoded.email,
      name: user.displayName,
    });
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

/**
 * POST /api/auth/logout
 * Revokes a token.
 */
router.post("/logout", async (req: Request, res: Response) => {
  const { token } = req.body;

  if (token) {
    tokenAuth.revokeToken(token);
  }

  res.json({ message: "Logged out successfully" });
});

/**
 * DELETE /api/auth/account
 * Deletes the authenticated user's account.
 */
router.delete("/account", requireAuth, async (req: AuthRequest, res: Response) => {
  const uid = req.user!.uid;

  try {
    await db.deleteUser(uid);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
