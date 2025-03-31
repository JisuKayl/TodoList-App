/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/tasks");
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return <></>;
};

export default App;
