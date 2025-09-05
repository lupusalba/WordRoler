// src/components/ui/Toast.tsx
import React, { createContext, useCallback, useContext, useState } from "react";

type ToastCtx = { show: (msg: string, ms?: number) => void };
const Ctx = createContext<ToastCtx | null>(null);

export const useToast = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider/>");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [msg, setMsg] = useState<string | null>(null);

  const show = useCallback((m: string, ms = 2500) => {
    setMsg(m);
    window.clearTimeout((show as any)._t);
    (show as any)._t = window.setTimeout(() => setMsg(null), ms);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {/* Simple, accessible toast at the bottom center */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 24,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {msg && (
          <div
            role="status"
            style={{
              pointerEvents: "auto",
              maxWidth: 520,
              padding: "10px 14px",
              borderRadius: 10,
              boxShadow: "0 6px 20px rgba(0,0,0,.15)",
              background: "rgba(20,20,20,.92)",
              color: "white",
              fontSize: 14,
              lineHeight: 1.35,
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
};
