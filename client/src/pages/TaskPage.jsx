import React, { useState, useEffect } from "react";
import { fetchTasks } from "../services/taskService";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const taskData = await fetchTasks();
    setTasks(taskData);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <TaskForm loadTasks={loadTasks} />
      <TaskList tasks={tasks} loadTasks={loadTasks} />
    </div>
  );
};

export default TaskPage;
