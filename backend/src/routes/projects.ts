import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { ProjectModel } from "../models";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Get all projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.getAll();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get project by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const projects = await ProjectModel.getAll();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Create new project (admin only)
router.post(
  "/",
  authenticateToken,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("technologies").isArray().withMessage("Technologies must be an array"),
    body("status")
      .isIn(["completed", "in-progress", "planned"])
      .withMessage("Invalid status"),
    body("display_order")
      .isInt({ min: 0 })
      .withMessage("Display order must be a non-negative integer"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        long_description,
        technologies,
        image_url,
        demo_url,
        github_url,
        is_featured,
        display_order,
        status,
      } = req.body;

      const projectData = {
        title,
        description,
        long_description: long_description || null,
        technologies: technologies || [],
        image_url: image_url || null,
        demo_url: demo_url || null,
        github_url: github_url || null,
        is_featured: is_featured || false,
        display_order: display_order || 0,
        status: status || "planned",
      };

      const newProject = await ProjectModel.create(projectData);

      res.status(201).json({
        message: "Project created successfully",
        project: newProject,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  }
);

// Update project (admin only)
router.put(
  "/:id",
  authenticateToken,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("technologies").isArray().withMessage("Technologies must be an array"),
    body("status")
      .isIn(["completed", "in-progress", "planned"])
      .withMessage("Invalid status"),
    body("display_order")
      .isInt({ min: 0 })
      .withMessage("Display order must be a non-negative integer"),
  ],
  async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if project exists
      const projects = await ProjectModel.getAll();
      const existingProject = projects.find((p) => p.id === projectId);
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      const {
        title,
        description,
        long_description,
        technologies,
        image_url,
        demo_url,
        github_url,
        is_featured,
        display_order,
        status,
      } = req.body;

      const projectData = {
        title,
        description,
        long_description: long_description || null,
        technologies: technologies || [],
        image_url: image_url || null,
        demo_url: demo_url || null,
        github_url: github_url || null,
        is_featured: is_featured || false,
        display_order: display_order || 0,
        status: status || "planned",
      };

      const updatedProject = await ProjectModel.update(projectId, projectData);

      res.json({
        message: "Project updated successfully",
        project: updatedProject,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  }
);

// Delete project (admin only)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      // Check if project exists
      const projects = await ProjectModel.getAll();
      const existingProject = projects.find((p) => p.id === projectId);
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      const deleted = await ProjectModel.delete(projectId);

      if (deleted) {
        res.json({ message: "Project deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete project" });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  }
);

// Get featured projects
router.get("/featured/list", async (req: Request, res: Response) => {
  try {
    const featuredProjects = await ProjectModel.getFeatured();
    res.json(featuredProjects);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({ error: "Failed to fetch featured projects" });
  }
});

export default router;
