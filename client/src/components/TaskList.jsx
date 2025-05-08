import React from "react";
import { useTaskContext } from "../context/TaskContext";
import { fetchTaskById, deleteTaskById } from "../services/taskService";
import PaginationControls from "./PaginationControls";

const TaskList = () => {
  const { tasks, loadTasks, setSelectedTask, setMode, page, pagination } =
    useTaskContext();

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
      alert("Task deleted successfully!");
      loadTasks(page);
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
            const globalIndex = (page - 1) * pagination.limit + index + 1;
            return (
              <li key={task.id}>
                {globalIndex}. {task.title} - {task.description}
                <button
                  onClick={() => {
                    handleSelectTask(task.id);
                    setMode("view");
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    handleSelectTask(task.id);
                    setMode("edit");
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
      <PaginationControls />
    </div>
  );
};

export default TaskList;
