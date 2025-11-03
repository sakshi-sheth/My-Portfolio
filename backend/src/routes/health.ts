import express from "express";
import pool from "../config/database";

const router = express.Router();

// Health check endpoint
router.get("/", async (req, res) => {
  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
    });
  }
});

// Database connectivity check
router.get("/db", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute("SELECT 1 as test");
    connection.release();

    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Test data retrieval
router.get("/test-data", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Test each table
    const [skills] = await connection.execute(
      "SELECT COUNT(*) as count FROM skills"
    );
    const [experience] = await connection.execute(
      "SELECT COUNT(*) as count FROM experience"
    );
    const [projects] = await connection.execute(
      "SELECT COUNT(*) as count FROM projects"
    );
    const [messages] = await connection.execute(
      "SELECT COUNT(*) as count FROM contact_messages"
    );
    const [users] = await connection.execute(
      "SELECT COUNT(*) as count FROM users"
    );

    connection.release();

    res.json({
      status: "healthy",
      database: "connected",
      tables: {
        skills: (skills as any)[0].count,
        experience: (experience as any)[0].count,
        projects: (projects as any)[0].count,
        messages: (messages as any)[0].count,
        users: (users as any)[0].count,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
