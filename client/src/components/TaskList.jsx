import React, { useState, useEffect } from "react";
import { fetchTasks } from "../services/taskService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const loadTask = async () => {
    try {
      const taskData = await fetchTasks();
      setTasks(taskData);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  return (
    <div>
      <ul>
        {tasks.map((task, index) => {
          return (
            <li key={index}>
              {index + 1}. {task.title} - {task.description}
              <button>View</button>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;
