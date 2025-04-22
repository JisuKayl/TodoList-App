import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [viewingId, setViewingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const resetFormState = () => {
    setViewingId(null);
    setEditingId(null);
    setTitle("");
    setDescription("");
  };

  const checkDuplicateTitle = async (title, excludeCurrentEditingId = null) => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks`);
      return data.some(
        (task) =>
          task.id !== excludeCurrentEditingId &&
          task.title.toLowerCase() === title.trim().toLowerCase()
      );
    } catch (err) {
      console.error("Failed to check duplicate title", err);
      return false;
    }
  };

  const handleDuplicateCheck = async () => {
    const isDuplicate = await checkDuplicateTitle(title, editingId);
    if (isDuplicate) {
      alert("Title is already taken");
      return true;
    }
    return false;
  };

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchTaskById = async (id) => {
    if (!id) return;

    try {
      const { data } = await axios.get(`${API_URL}/tasks/${id}`);
      console.log(data);
      setEditingId(null);
      setViewingId(data.id);
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

    const isDuplicate = await handleDuplicateCheck(title);

    if (isDuplicate) return;

    try {
      await axios.post(`${API_URL}/tasks`, { title, description });
      resetFormState();
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
    setViewingId(null);
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const isDuplicate = await handleDuplicateCheck();
    if (isDuplicate) return;

    try {
      await axios.put(`${API_URL}/tasks/${editingId}`, {
        title,
        description,
      });
      resetFormState();
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteAllTasks = async () => {
    try {
      await axios.delete(`${API_URL}/tasks`);
      resetFormState();
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete all tasks", err);
    }
  };

  const deleteTaskById = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      resetFormState();
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
        disabled={viewingId}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={viewingId}
      />

      {editingId ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={resetFormState}>Cancel</button>
        </>
      ) : (
        <button onClick={addTask}>Add Task</button>
      )}

      <button onClick={deleteAllTasks}>Delete All Tasks</button>
      <button onClick={resetFormState}>Clear</button>
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
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default App;
