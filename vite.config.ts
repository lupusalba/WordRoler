// Vite config: TS + React, aliases, fast HMR
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { alias: { "@": "/src" } },
  server: { port: 5173 }
});
