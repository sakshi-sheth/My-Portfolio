import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function runMigrations() {
  try {
    console.log("🔄 Starting MySQL database migration...");

    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306"),
    });

    console.log("✅ Connected to MySQL database");

    // Read and execute schema migration
    const schemaPath = path.join(__dirname, "001_initial_schema_mysql.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    console.log("🔄 Running schema migration...");
    // Split schema SQL into individual statements
    const schemaStatements = schemaSQL
      .split(";")
      .filter((statement) => statement.trim().length > 0)
      .map((statement) => statement.trim());

    for (const statement of schemaStatements) {
      if (statement.length > 0) {
        await connection.execute(statement);
      }
    }
    console.log("✅ Schema migration completed");

    // Read and execute sample data migration
    const dataPath = path.join(__dirname, "002_sample_data_mysql.sql");
    const dataSQL = fs.readFileSync(dataPath, "utf8");

    console.log("🔄 Inserting sample data...");
    // Split by statements and execute one by one
    const statements = dataSQL
      .split(";")
      .filter((statement) => statement.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log("✅ Sample data inserted");

    await connection.end();
    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
