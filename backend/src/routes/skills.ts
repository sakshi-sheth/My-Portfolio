import express, { Response } from "express";
import { SkillModel } from "../models";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await SkillModel.getAll();
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get skills by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await SkillModel.getByCategory(category);
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get featured skills
router.get("/featured", async (req, res) => {
  try {
    const skills = await SkillModel.getFeatured();
    res.json(skills);
  } catch (error) {
    console.error("Error fetching featured skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new skill (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name").notEmpty().trim(),
    body("category").isIn(["frontend", "backend", "tools", "other"]),
    body("proficiency").isInt({ min: 0, max: 100 }),
    body("display_order").optional().isInt({ min: 0 }),
    body("is_featured").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const skill = await SkillModel.create(req.body);
      res.status(201).json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update skill (admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    body("name").optional().notEmpty().trim(),
    body("category").optional().isIn(["frontend", "backend", "tools", "other"]),
    body("proficiency").optional().isInt({ min: 0, max: 100 }),
    body("display_order").optional().isInt({ min: 0 }),
    body("is_featured").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const skill = await SkillModel.update(parseInt(id), req.body);

      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.json(skill);
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete skill (admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await SkillModel.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
