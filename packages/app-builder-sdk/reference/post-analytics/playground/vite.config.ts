import tailwind from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const here = fileURLToPath(new URL(".", import.meta.url))
const nm = (pkg: string) => fileURLToPath(new URL(`./node_modules/${pkg}`, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    port: 5194,
    strictPort: false,
  },
  resolve: {
    preserveSymlinks: false,
    alias: {
      "@hitechcloud/ui/styles.css": `${nm("@hitechcloud/ui")}/dist/styles.css`,
      "@hitechcloud/ui": nm("@hitechcloud/ui"),
      "lucide-react": nm("lucide-react"),
      react: nm("react"),
      "react-dom": nm("react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["@hitechcloud/ui", "lucide-react", "react", "react-dom", "react-dom/client"],
  },
  root: here,
})
