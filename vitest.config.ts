import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/**/*.test.ts",
      "composables/**/*.test.ts",
      "components/**/*.test.ts",
      "middleware/**/*.test.ts",
    ],
    exclude: ["e2e/**/*.spec.ts", "node_modules/**"],
    alias: {
      "~": path.resolve(__dirname, "."),
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."),
    },
  },
});
