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

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

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
  try {
    const { id } = req.params;
    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", id);

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
  try {
    const { title, description } = req.body;
    const [result] = await db.query(
      "INSERT INTO tasks (title, description) values (?, ?)",
      [title, description || "(No Description)"]
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
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const [result] = await db.query(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
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
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);

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
