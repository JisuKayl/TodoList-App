const db = require("../config/db");

exports.getAllTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  if (isNaN(parsedPage) || parsedPage < 1) {
    return res.status(400).json({ error: "Invalid page number" });
  }

  if (isNaN(parsedLimit) || parsedLimit < 1) {
    return res.status(400).json({ error: "Invalid limit number" });
  }

  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const [tasks] = await db.query("SELECT * FROM tasks LIMIT ? OFFSET ?", [
      parsedLimit,
      offset,
    ]);

    if (tasks.length === 0) {
      res.status(404).json({ error: "No tasks found" });
    }

    const [totalTasks] = await db.query("SELECT COUNT(*) AS count FROM tasks");
    const totalTaskCount = totalTasks[0].count;

    res.status(200).json({
      tasks,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: totalTaskCount,
        totalPages: Math.ceil(totalTaskCount / parsedLimit),
      },
    });
  } catch (err) {
    console.error("Error in fetching tasks", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

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

  const parsedId = parseInt(id, 10);
  const trimmedTitle = title.trim();
  const trimmedDesc = description?.trim() || "(No Description)";

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!trimmedTitle) {
    return res.status(400).json({ error: "Title is required" });
  }

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
    res.status(500).json({ error: "Internal server error" });
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
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

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
