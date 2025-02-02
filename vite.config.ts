import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/sponsor": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/execute": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      }
    },
  },
});