import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const clearAllFields = () => {
    setTitle("");
    setDescription("");
  };

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchTaskById = async (id) => {
    if (!id) return;

    try {
      const { data } = await axios.get(`http://localhost:3000/tasks/${id}`);
      console.log(data);
      setTitle(data.title);
      setDescription(data.description);
    } catch (err) {
      console.error("Failed to fetch task", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      await axios.post("http://localhost:3000/tasks", { title, description });
      clearAllFields();
      fetchTasks();
    } catch (err) {
      console.error("Failed to add tasks", err);
    }
  };

  // const updateTask = async (id) => {
  //   if (!id) return;
  //   try {
  //     await axios.put(`http://localhost:3000/tasks/${id}`, {
  //       title,
  //       description,
  //     });
  //     clearAllFields();
  //     fetchTasks();
  //   } catch (err) {
  //     console.error("Failed to update task", err);
  //   }
  // };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/tasks/${editingId}`, {
        title,
        description,
      });
      clearAllFields();
      fetchTasks();
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update task", err);
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

  const deleteTaskById = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
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

      {editingId ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={clearAllFields}>Cancel</button>
        </>
      ) : (
        <button onClick={addTask}>Add Task</button>
      )}

      <button onClick={deleteAllTasks}>Delete All Tasks</button>
      <button onClick={clearAllFields}>Clear</button>
      {tasks.length === 0 ? (
        <p>No Tasks Available</p>
      ) : (
        <ul>
          {tasks.map((task, index) => {
            return (
              <li key={task.id}>
                {index + 1}. Title: {task.title} - Description:{" "}
                {task.description}
                <button onClick={() => fetchTaskById(task.id)}>View</button>
                <button
                  onClick={() => {
                    handleEdit(task);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteTaskById(task.id)}>Delete</button>
                <button></button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default App;
