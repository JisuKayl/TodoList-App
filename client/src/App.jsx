import React from "react";
import { TaskProvider } from "./context/TaskContext";
import TaskPage from "./pages/TaskPage";

const App = () => {
  return (
    <div>
      <TaskProvider>
        <TaskPage />
      </TaskProvider>
    </div>
  );
};

export default App;
