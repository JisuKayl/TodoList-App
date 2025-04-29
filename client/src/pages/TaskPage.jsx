import React, { useState, useEffect } from "react";
import { fetchTasks } from "../services/taskService";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const taskData = await fetchTasks();
      setTasks(taskData);
    } catch (err) {
      console.error("Failed to load tasks", err);
      alert("Failed to load tasks.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <TaskForm tasks={tasks} loadTasks={loadTasks} />
      <TaskList tasks={tasks} loadTasks={loadTasks} />
    </div>
  );
};

export default TaskPage;
