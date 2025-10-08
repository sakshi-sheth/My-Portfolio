import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { ContactModel } from "../models";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = express.Router();

// Rate limiting for contact form submissions
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    error: "Too many contact form submissions. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Get all contact messages (admin only)
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const messages = await ContactModel.getAll();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get contact message by ID (admin only)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await ContactModel.findById(parseInt(id));

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error fetching contact message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new contact message
router.post(
  "/",
  contactRateLimit,
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("subject")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Subject must be between 5 and 200 characters"),
    body("message")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { name, email, subject, message } = req.body;

      // Create the contact message
      const newMessage = await ContactModel.create({
        name,
        email,
        subject,
        message,
      });

      // TODO: Send email notification to admin
      // This would typically integrate with a service like SendGrid, Nodemailer, etc.
      console.log("New contact message received:", {
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
      });

      res.status(201).json({
        success: true,
        message: "Your message has been sent successfully!",
        id: newMessage.id,
      });
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({
        error: "Failed to send message. Please try again later.",
      });
    }
  }
);

// Update contact message status (admin only)
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be 'unread', 'read', or 'replied'",
      });
    }

    const updatedMessage = await ContactModel.updateStatus(
      parseInt(id),
      status
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({
      success: true,
      message: "Message status updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark message as read (admin only) - convenience endpoint
router.put("/:id/read", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedMessage = await ContactModel.updateStatus(
      parseInt(id),
      "read"
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({
      success: true,
      message: "Message marked as read",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete contact message (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ContactModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get contact statistics (admin only)
router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const stats = await ContactModel.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching contact stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
