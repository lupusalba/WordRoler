// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ErrorBoundary } from "./components/dev/ErrorBoundary";
import "./styles/globals.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element with id='root' not found in index.html");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
