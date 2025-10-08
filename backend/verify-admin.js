const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function verifyAdmin() {
  try {
    // Create database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to database...");

    // Check for admin user
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      ["sakshisheth100@gmail.com"]
    );

    if (rows.length > 0) {
      const user = rows[0];
      console.log("✅ Admin user found:");
      console.log("Email:", user.email);
      console.log("Role:", user.role);
      console.log("Password hash exists:", user.password ? "Yes" : "No");

      // Test password verification
      const isValidPassword = bcrypt.compareSync("Sakshi@123", user.password);
      console.log(
        "Password verification:",
        isValidPassword ? "✅ Valid" : "❌ Invalid"
      );
    } else {
      console.log("❌ Admin user not found!");
      console.log("Let me check all users:");
      const [allUsers] = await connection.execute(
        "SELECT email, role FROM users"
      );
      console.log(allUsers);
    }

    // Close connection
    await connection.end();
  } catch (error) {
    console.error("Error verifying admin:", error);
  }
}

verifyAdmin();
