import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirect only API requests to the backend
      "/api": {
        target: "http://127.0.0.1:5000", // Your backend URL
        changeOrigin: true, // Ensures the request origin matches the target
        secure: false, // Disable SSL verification if needed
      },
    },
    historyApiFallback: true,
  },
});
