import React from "react";
import { fetchTaskById, deleteTaskById } from "../services/taskService";

const TaskList = ({ tasks, loadTasks, setSelectedTask }) => {
  const handleSelectTask = async (id) => {
    try {
      const task = await fetchTaskById(id);
      setSelectedTask(task);
    } catch (err) {
      console.error("Failed to view task", err);
      alert("Failed to view task.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
      );
      if (!confirmDelete) return;

      await deleteTaskById(id);
      loadTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task.");
    }
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => {
            return (
              <li key={index}>
                {index + 1}. {task.title} - {task.description}
                <button
                  onClick={() => {
                    handleSelectTask(task.id);
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    handleSelectTask(task.id);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDeleteTask(task.id);
                  }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
