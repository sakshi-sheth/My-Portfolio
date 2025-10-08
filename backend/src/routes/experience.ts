import express, { Response } from "express";
import { ExperienceModel } from "../models";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Get all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await ExperienceModel.getAll();
    res.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new experience (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("title").notEmpty().trim(),
    body("company").notEmpty().trim(),
    body("location").notEmpty().trim(),
    body("start_date").isISO8601(),
    body("end_date")
      .optional({ values: "null" })
      .custom((value) => {
        if (value === null || value === undefined || value === "") {
          return true;
        }
        // If value exists, it should be a valid ISO8601 date
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new Error("Invalid date format. Expected YYYY-MM-DD");
        }
        return true;
      }),
    body("is_current").isBoolean(),
    body("description").notEmpty().trim(),
    body("responsibilities").isArray(),
    body("technologies").isArray(),
    body("display_order").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      console.log("Received experience data:", req.body);
      console.log("User:", req.user);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const experienceData = {
        ...req.body,
        display_order: req.body.display_order || 0,
      };

      console.log("Processed experience data:", experienceData);

      const experience = await ExperienceModel.create(experienceData);
      console.log("Created experience:", experience);
      res.status(201).json(experience);
    } catch (error) {
      console.error("Error creating experience:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Update experience (admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    body("title").optional().notEmpty().trim(),
    body("company").optional().notEmpty().trim(),
    body("location").optional().notEmpty().trim(),
    body("start_date").optional().isISO8601(),
    body("end_date")
      .optional({ values: "null" })
      .custom((value) => {
        if (value === null || value === undefined || value === "") {
          return true;
        }
        // If value exists, it should be a valid ISO8601 date
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new Error("Invalid date format. Expected YYYY-MM-DD");
        }
        return true;
      }),
    body("is_current").optional().isBoolean(),
    body("description").optional().notEmpty().trim(),
    body("responsibilities").optional().isArray(),
    body("technologies").optional().isArray(),
    body("display_order").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const experience = await ExperienceModel.update(parseInt(id), req.body);

      if (!experience) {
        return res.status(404).json({ error: "Experience not found" });
      }

      res.json(experience);
    } catch (error) {
      console.error("Error updating experience:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete experience (admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await ExperienceModel.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({ error: "Experience not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting experience:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
