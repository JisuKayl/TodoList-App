import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  fetchTaskById,
  deleteAllTasks,
  deleteTaskById,
} from "../services/taskService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const taskData = await fetchTasks();
      setTasks(taskData);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  const handleViewTask = async (id) => {
    try {
      const task = await fetchTaskById(id);
      console.log("Task Details:", task);
    } catch (err) {
      console.error("Failed to fetch task", err);
    }
  };

  const handleDeleteAllTasks = async () => {
    try {
      await deleteAllTasks();
      loadTasks();
    } catch (err) {
      console.error("Failed to delete all tasks", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskById(id);
      loadTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <button onClick={handleDeleteAllTasks}>Delete All Tasks</button>
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
                    handleViewTask(task.id);
                  }}
                >
                  View
                </button>
                <button>Edit</button>
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
