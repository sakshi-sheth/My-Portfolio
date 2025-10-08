import bcrypt from "bcryptjs";
import pool from "../config/database";
import { UserModel } from "../models";

async function createDefaultAdmin() {
  try {
    console.log("Creating default admin user...");

    // Check if admin user already exists
    const existingAdmin = await UserModel.findByEmail("admin@portfolio.com");
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = await UserModel.create({
      email: "admin@portfolio.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Default admin user created successfully:");
    console.log("Email: admin@portfolio.com");
    console.log("Password: admin123");
    console.log("Please change this password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await pool.end();
  }
}

createDefaultAdmin();
