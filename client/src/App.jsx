/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const addTask = async () => {
    try {
      await axios.post("http://localhost:3000/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.error("Failed to add tasks", err);
    }
  };

  const deleteAllTasks = async () => {
    try {
      await axios.delete("http://localhost:3000/tasks");
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete all tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <h1>To-do Lists</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <button onClick={deleteAllTasks}>Delete All Tasks</button>
      <ul>
        {tasks.map((task, index) => {
          return (
            <li key={task.id}>
              {index + 1}. Title: {task.title} - Description: {task.description}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default App;
