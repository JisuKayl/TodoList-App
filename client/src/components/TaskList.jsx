import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  fetchTaskById,
  deleteTaskById,
} from "../services/taskService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const taskData = await fetchTasks();
    setTasks(taskData);
  };

  const handleViewTask = async (id) => {
    const task = await fetchTaskById(id);
    console.log("Task Details:", task);
  };

  const handleDeleteTask = async (id) => {
    await deleteTaskById(id);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

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
