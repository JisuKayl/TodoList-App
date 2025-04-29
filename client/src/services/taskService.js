import axios from "axios";
import { API_URL } from "../config/apiConfig";

export const fetchTasks = async () => {
  const { data } = await axios.get(`${API_URL}/tasks`);
  return data;
};

export const fetchTaskById = async (id) => {
  const { data } = await axios.get(`${API_URL}/tasks/${id}`);
  return data;
};

export const addTask = async (title, description) => {
  await axios.post(`${API_URL}/tasks`, { title, description });
};

export const updateTask = async (id, title, description) => {
  await axios.put(`${API_URL}/tasks/${id}`, {
    title,
    description,
  });
};

export const deleteAllTasks = async () => {
  await axios.delete(`${API_URL}/tasks`);
};

export const deleteTaskById = async (id) => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};

export const checkDuplicateTitle = async (
  title,
  excludeCurrentEditingId = null
) => {
  const { data } = await axios.get(`${API_URL}/tasks`);
  return data.some(
    (task) =>
      task.id !== excludeCurrentEditingId &&
      task.title.toLowerCase() === title.trim().toLowerCase()
  );
};
