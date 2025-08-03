import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5001",
    },
    port: 5173,
    host: true,
  },
  build: {
    target: "es2015",
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "react-icons"],
          utils: ["axios", "swr"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
      "@config": resolve(__dirname, "src/config"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@context": resolve(__dirname, "src/Context"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios", "swr"],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});
