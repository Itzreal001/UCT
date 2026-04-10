import { Router, type Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.ts";

const router = Router();

// In-memory presence store (for demo purposes)
const presenceStore: Record<string, { online: boolean; lastSeen: string }> = {};

router.use(requireAuth);

/**
 * GET /api/realtime/presence
 * Returns the user's current online presence.
 */
router.get("/presence", async (req: AuthRequest, res: Response) => {
  const uid = req.user!.uid;

  try {
    const presence = presenceStore[uid] || { online: false, lastSeen: new Date().toISOString() };
    res.json(presence);
  } catch (err) {
    console.error("Presence error:", err);
    res.status(500).json({ error: "Failed to get presence" });
  }
});

/**
 * POST /api/realtime/presence
 * Updates the user's presence.
 * Body: { online: boolean }
 */
router.post("/presence", async (req: AuthRequest, res: Response) => {
  const uid = req.user!.uid;
  const { online } = req.body;

  try {
    presenceStore[uid] = {
      online: !!online,
      lastSeen: new Date().toISOString(),
    };
    res.json({ message: "Presence updated" });
  } catch (err) {
    console.error("Presence update error:", err);
    res.status(500).json({ error: "Failed to update presence" });
  }
});

/**
 * GET /api/realtime/announcements
 * Returns latest campus announcements (mock data).
 */
router.get("/announcements", async (_req: AuthRequest, res: Response) => {
  try {
    // Return mock announcements
    const announcements = [
      {
        id: "1",
        title: "Library Extension Hours",
        message: "The library will be open until midnight during exam season.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Campus Maintenance",
        message: "Parking lot A will be closed for resurfacing from April 15-20.",
        createdAt: new Date().toISOString(),
      },
    ];
    res.json({ announcements });
  } catch (err) {
    console.error("Announcements error:", err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

export default router;
