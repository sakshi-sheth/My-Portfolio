import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { PersonalInfoModel } from "../models";

const router = express.Router();

// Get profile information
router.get("/", async (req: Request, res: Response) => {
  try {
    const profile = await PersonalInfoModel.get();
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create or update profile (admin only)
router.put(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("bio").optional().trim(),
    body("phone").optional().trim(),
    body("location").optional().trim(),
    body("linkedin_url").optional().isURL().withMessage("Invalid LinkedIn URL"),
    body("github_url").optional().isURL().withMessage("Invalid GitHub URL"),
    body("resume_url").optional().isURL().withMessage("Invalid Resume URL"),
    body("profile_image_url")
      .optional()
      .isURL()
      .withMessage("Invalid Profile Image URL"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const profileData = {
        name: req.body.name,
        title: req.body.title,
        bio: req.body.bio || "",
        email: req.body.email,
        phone: req.body.phone || null,
        location: req.body.location || "",
        linkedin_url: req.body.linkedin_url || null,
        github_url: req.body.github_url || null,
        resume_url: req.body.resume_url || null,
        profile_image_url: req.body.profile_image_url || null,
      };

      const profile = await PersonalInfoModel.createOrUpdate(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
