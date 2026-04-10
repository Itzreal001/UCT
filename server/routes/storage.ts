import { Router, type Response } from "express";
import multer from "multer";
import { db } from "../lib/db.ts";
import { requireAuth, type AuthRequest } from "../middleware/auth.ts";

const router = Router();

// Store file in memory before uploading
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * POST /api/storage/profile-photo
 * Uploads a profile photo and updates the user's photoURL.
 * Note: In this simplified version, files are not actually stored.
 * In production, integrate with a cloud storage service.
 */
router.post(
  "/profile-photo",
  requireAuth,
  upload.single("photo"),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const uid = req.user!.uid;

    try {
      // Generate a mock photo URL
      const photoURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64").substring(0, 100)}...`;

      // Update user profile with new photo URL
      await db.updateUser(uid, { photoURL });

      res.json({
        message: "Photo uploaded successfully",
        photoURL,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  }
);

export default router;
