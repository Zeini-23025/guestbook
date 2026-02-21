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
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL
      )
    `);
    console.log("Tables ready :3");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    client.release();
  }
})();

// ---------------------------
// POST /api/visitors
// ---------------------------
app.post("/api/visitors", async (req, res) => {
  const { name, country } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO visitors (name, country) VALUES ($1, $2) RETURNING *",
      [name, country]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("POST /api/visitors error:", err);
    res.status(500).json({ error: "Error saving visitor :3" });
  }
});

// ---------------------------
// GET /api/visitors
// ---------------------------
app.get("/api/visitors", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM visitors ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/visitors error:", err);
    res.status(500).json({ error: "Error fetching visitors" });
  }
});

// ---------------------------
// Test route
// ---------------------------
app.get("/", (_req, res) => res.send("API Running onii-chan :3"));

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} :3`));