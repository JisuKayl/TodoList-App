/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <ul>
        {tasks.map((task) => {
          return (
            <li key={task.id}>
              Title: {task.title} - Description: {task.description}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default App;
