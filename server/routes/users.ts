import { Router, type Response } from "express";
import { db } from "../lib/db.ts";
import { requireAuth, type AuthRequest } from "../middleware/auth.ts";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

/**
 * GET /api/users/me
 * Returns the authenticated user's full profile.
 */
router.get("/me", async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.getUserById(req.user!.uid);

    if (!user) {
      res.status(404).json({ error: "User profile not found" });
      return;
    }

    // Remove password hash before sending
    res.json(db.sanitizeUser(user));
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * PATCH /api/users/me
 * Updates allowed fields on the user's profile.
 */
router.patch("/me", async (req: AuthRequest, res: Response) => {
  const allowedFields = [
    "preferredName",
    "cellNumber",
    "homeLanguage",
    "photoURL",
    "faculty",
    "program",
    "yearOfStudy",
  ];

  const updates: Record<string, any> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No valid fields provided" });
    return;
  }

  try {
    await db.updateUser(req.user!.uid, updates);
    res.json({ message: "Profile updated", updates });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * GET /api/users/me/courses
 * Returns the user's enrolled courses.
 */
router.get("/me/courses", async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.getUserById(req.user!.uid);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ courses: user.enrolledCourses || [] });
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

/**
 * GET /api/users/me/finances
 * Returns mock financial summary (demo data).
 */
router.get("/me/finances", async (req: AuthRequest, res: Response) => {
  try {
    // Return demo financial data
    res.json({
      totalDue: 90400,
      paidToDate: 21050,
      outstanding: 69350,
      paymentPlan: "Active – next payment due 30 April 2026",
      fees: [
        { type: "Tuition – Year 3 (2026)", amount: 52800, status: "❌ Unpaid", dueDate: "31 March 2026" },
        { type: "Residence & Meals", amount: 34600, status: "Partially paid (R20,000 paid)", dueDate: "31 March 2026" },
        { type: "SRC Levy", amount: 200, status: "❌ Unpaid", dueDate: "30 April 2026" },
        { type: "ICT & Library Services", amount: 750, status: "✅ Paid", dueDate: null },
        { type: "Sports & Recreation", amount: 300, status: "✅ Paid", dueDate: null },
        { type: "Student Health Plan (Years 3–4)", amount: 0, status: "✅ Covered – included in tuition", dueDate: null },
        { type: "Graduation Deposit (Year 4 prep)", amount: 1750, status: "❌ Unpaid", dueDate: "15 June 2026" },
      ],
    });
  } catch (err) {
    console.error("Get finances error:", err);
    res.status(500).json({ error: "Failed to fetch financial data" });
  }
});

/**
 * GET /api/users/me/notifications
 * Returns mock notifications (demo data).
 */
router.get("/me/notifications", async (req: AuthRequest, res: Response) => {
  try {
    // Return empty notifications for demo
    res.json({ notifications: [] });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

/**
 * PATCH /api/users/me/notifications/:id/read
 * Marks a notification as read.
 */
router.patch("/me/notifications/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

/**
 * GET /api/users/me/timetable
 * Returns mock timetable (demo data).
 */
router.get("/me/timetable", async (req: AuthRequest, res: Response) => {
  try {
    // Return empty timetable for demo
    res.json({ schedule: [] });
  } catch (err) {
    console.error("Get timetable error:", err);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
});

export default router;
