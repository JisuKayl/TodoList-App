import React, { useState } from "react";
import {
  addTask,
  checkDuplicateTitle,
  deleteAllTasks,
} from "../services/taskService";

const TaskForm = ({ tasks, loadTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const resetFormState = async () => {
    setTitle("");
    setDescription("");
  };

  const handleAddTask = async () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      const isDuplicate = await checkDuplicateTitle(title);
      if (isDuplicate) {
        alert("Title is already taken. Please choose a different title.");
        return;
      }

      await addTask(title, description);
      alert("Task added successfully!");
      resetFormState();
      loadTasks();
    } catch (err) {
      console.error("Failed to add task", err);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleDeleteAllTasks = async () => {
    if (tasks.length === 0) {
      alert("There are no tasks to delete.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete all tasks?");
    if (!confirmDelete) return;

    try {
      await deleteAllTasks();
      alert("All tasks deleted successfully!");
      resetFormState();
      loadTasks();
    } catch (err) {
      console.error("Failed to delete all tasks", err);
      alert("Failed to delete all tasks.");
    }
  };

  return (
    <div>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="description"
        />
      </div>
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleDeleteAllTasks}>Delete All Tasks</button>
      <button onClick={resetFormState}>Clear</button>
    </div>
  );
};

export default TaskForm;
