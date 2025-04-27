import React, { useState } from "react";
import {
  addTask,
  checkDuplicateTitle,
  deleteAllTasks,
} from "../services/taskService";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const resetFormState = async () => {
    setTitle("");
    setDescription("");
  };

  const handleAddTask = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const isDuplicate = await checkDuplicateTitle(title);
    if (isDuplicate) {
      alert("Title is already taken. Please choose a different title");
      return;
    }

    await addTask(title, description);
    alert("Task added successfully!");
    resetFormState();
  };

  const handleDeleteAllTasks = async () => {
    await deleteAllTasks();
    resetFormState();
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleDeleteAllTasks}>Delete All Tasks</button>
      <button onClick={resetFormState}>Clear</button>
    </div>
  );
};

export default TaskForm;
