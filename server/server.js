require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

const db = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Connected to MySQL");
  } catch (err) {
    console.error("MySQL connection failed", err);
  }
})();

app.get("/", (req, res) => {
  res.json("Test");
});

app.get("/tasks", async (req, res) => {
  try {
    const [task] = await db.query("SELECT * FROM tasks");
    res.status(200).json(task);
  } catch (err) {
    console.error("Error in fetching tasks", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const parsedId = parseInt(id, 10);

  try {
    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [
      parsedId,
    ]);

    if (task.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task[0]);
  } catch (err) {
    console.error("Error in fetching task", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const desc = description?.trim() || "(No Description)";

  try {
    const [existingTitle] = await db.query(
      "SELECT * FROM tasks WHERE title = ?",
      [title]
    );

    if (existingTitle.length > 0) {
      return res.status(400).json({ error: "Title must be unique" });
    }

    const [result] = await db.query(
      "INSERT INTO tasks (title, description) values (?, ?)",
      [title, desc]
    );
    res
      .status(201)
      .json({ message: "Task created successfully", id: result.insertId });
  } catch (err) {
    console.error("Error in creating tasks", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const parsedId = parseInt(id, 10);
  const desc = description?.trim() || "(No Description)";

  try {
    const [existingTitle] = await db.query(
      "SELECT * FROM tasks WHERE title = ? AND id != ?",
      [title, parsedId]
    );

    if (existingTitle.length > 0) {
      return res.status(400).json({ error: "Title must be unique" });
    }

    const [result] = await db.query(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
      [title, desc, parsedId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error in updating task", err);
    res.status(500).json("Internal server error");
  }
});

app.delete("/tasks", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM tasks");

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }

    res.status(200).json({ message: "All tasks deleted successfully" });
  } catch (err) {
    console.error("Error in deleting all task", err);
    res.status(500).json("Internal server error");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const parsedId = parseInt(id, 10);

  try {
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [
      parsedId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error in deleting task", err);
    res.status(500).json("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
