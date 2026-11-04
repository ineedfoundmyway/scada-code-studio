import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/scada-code-studio/",
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
});
