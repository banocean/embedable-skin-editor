import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "ncrs-editor",
      fileName: "ncrs-editor",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "ajv", "color", "lit", "panzoom",
        "sortablejs", "three"
      ] 
    }
  }
})