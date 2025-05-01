import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchTasks } from "../services/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [mode, setMode] = useState("add");

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
    <TaskContext.Provider
      value={{ tasks, loadTasks, selectedTask, setSelectedTask, mode, setMode }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
