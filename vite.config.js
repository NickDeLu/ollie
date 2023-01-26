import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const viteEnv = {};
Object.keys(process.env).forEach((key) => {
  if (key.startsWith('VITE_')) {
    viteEnv[key] = process.env[key]
  }
})


export default defineConfig({
  define: viteEnv,
  plugins: [react()]
});