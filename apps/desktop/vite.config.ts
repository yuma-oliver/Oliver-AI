import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Plugin to stub all Node.js built-in modules for browser builds.
// This handles @anthropic-ai/sdk's agent-toolset which imports node:* but is
// never called when dangerouslyAllowBrowser=true and only messages API is used.
function nodeBuiltinStubPlugin(): Plugin {
  const stubId = path.resolve(__dirname, "src/stubs/node-stub.ts");
  return {
    name: "node-builtin-stub",
    enforce: "pre",
    resolveId(id) {
      if (id.startsWith("node:")) {
        return stubId;
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodeBuiltinStubPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Tauri expects a fixed port
  server: {
    port: 1420,
    strictPort: true,
  },
  // Tauri uses Rust's built-in http server in dev mode
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
    // Don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
