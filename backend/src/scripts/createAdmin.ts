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
    const hashedPassword = await bcrypt.hash("sakshi123", 12);

    const adminUser = await UserModel.create({
      email: "sakshisheth100@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Default admin user created successfully:");
    console.log("Email: sakshisheth100@gmail.com");
    console.log("Password: sakshi123");
    console.log("Please change this password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await pool.end();
  }
}

createDefaultAdmin();
