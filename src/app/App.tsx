// src/app/App.tsx
import React, { useEffect } from "react";
import Home from "@/pages/Home";
import { ToastProvider } from "@/components/ui/Toast";

const App: React.FC = () => {
  useEffect(() => {
    console.log("App mounted");
  }, []);

  return (
    <ToastProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 16
        }}
      >
        <header style={{ fontSize: 20, fontWeight: 700 }}>
          WordRoller
        </header>
        <Home />
      </div>
    </ToastProvider>
  );
};

export default App;
