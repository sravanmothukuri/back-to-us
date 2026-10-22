import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base matches the GitHub Pages repo name, like the birthday card's "homepage"
export default defineConfig({
  base: "/back-to-us/",
  plugins: [react()],
});
