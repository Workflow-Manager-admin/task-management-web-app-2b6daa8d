import React from "react";
import TodoPage from "./TodoPage";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  /** The root application for the TODO PAGE app (renders TodoPage component). */
  return (
    <div className="App">
      <TodoPage />
    </div>
  );
}

export default App;
