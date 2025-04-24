import axios from "axios";
import { API_URL } from "../config/apiConfig";

export const fetchTasks = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/tasks`);
    return data;
  } catch (err) {
    console.error("Failed to fetch tasks", err);
    return [];
  }
};

export const fetchTaskById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/tasks/${id}`);
    console.log(data);
    return data;
  } catch (err) {
    console.error("Failed to fetch task", err);
    return null;
  }
};

export const addTask = async (title, description) => {
  try {
    await axios.post(`${API_URL}/tasks`, { title, description });
  } catch (err) {
    console.error("Failed to add tasks", err);
  }
};

export const handleSave = async (id, title, description) => {
  try {
    await axios.put(`${API_URL}/tasks/${id}`, {
      title,
      description,
    });
  } catch (err) {
    console.error("Failed to update task", err);
  }
};

export const deleteAllTasks = async () => {
  try {
    await axios.delete(`${API_URL}/tasks`);
  } catch (err) {
    console.error("Failed to delete all tasks", err);
  }
};

export const deleteTaskById = async (id) => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}`);
  } catch (err) {
    console.error("Failed to delete task", err);
  }
};

export const checkDuplicateTitle = async (
  title,
  excludeCurrentEditingId = null
) => {
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
