const db = require("../config/db");

exports.getAllTasks = async (req, res) => {
  try {
    const [task] = await db.query("SELECT * FROM tasks");
    res.status(200).json(task);
  } catch (err) {
    console.error("Error in fetching tasks", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTaskById = async (req, res) => {
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
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  const trimmedTitle = title.trim();
  const trimmedDesc = description?.trim() || "(No Description)";

  if (!trimmedTitle) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const [existingTitle] = await db.query(
      "SELECT * FROM tasks WHERE title = ?",
      [trimmedTitle]
    );

    if (existingTitle.length > 0) {
      return res.status(400).json({ error: "Title must be unique" });
    }

    const [result] = await db.query(
      "INSERT INTO tasks (title, description) values (?, ?)",
      [trimmedTitle, trimmedDesc]
    );
    res
      .status(201)
      .json({ message: "Task created successfully", id: result.insertId });
  } catch (err) {
    console.error("Error in creating tasks", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const trimmedTitle = title.trim();
  const trimmedDesc = description?.trim() || "(No Description)";

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!trimmedTitle) {
    return res.status(400).json({ error: "Title is required" });
  }

  const parsedId = parseInt(id, 10);

  try {
    const [existingTitle] = await db.query(
      "SELECT * FROM tasks WHERE title = ? AND id != ?",
      [trimmedTitle, parsedId]
    );

    if (existingTitle.length > 0) {
      return res.status(400).json({ error: "Title must be unique" });
    }

    const [result] = await db.query(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
      [trimmedTitle, trimmedDesc, parsedId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error in updating task", err);
    res.status(500).json("Internal server error");
  }
};

exports.deleteAllTasks = async (req, res) => {
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
};

exports.deleteTaskById = async (req, res) => {
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
};
