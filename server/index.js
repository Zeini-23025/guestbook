require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------
// PostgreSQL connection
// ---------------------------
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI || "postgres://devuser:devpass@localhost:5432/mydatabase"
});

// ---------------------------
// Create users table if not exists
// ---------------------------
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    console.log("Users table ready ✅");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    client.release();
  }
})();

// ---------------------------
// POST /api/users
// ---------------------------
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("POST /api/users error:", err);
    res.status(500).json({ error: "Error saving user" });
  }
});

// ---------------------------
// GET /api/users
// ---------------------------
app.get("/api/users", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ---------------------------
// Test route
// ---------------------------
app.get("/", (_req, res) => res.send("API Running 🚀"));

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));