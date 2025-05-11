import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchTasks } from "../services/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [mode, setMode] = useState("add");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const loadTasks = async (pageToLoad = page) => {
    try {
      const { tasks, pagination } = await fetchTasks(pageToLoad);
      setTasks(tasks);
      setPagination(pagination);
      setPage(pageToLoad);
    } catch (err) {
      console.error("Failed to load tasks", err);
      alert("Failed to load tasks.");
    }
  };

  useEffect(() => {
    loadTasks(page);
  }, [page]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadTasks,
        selectedTask,
        setSelectedTask,
        mode,
        setMode,
        page,
        setPage,
        pagination,
        setPagination,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
