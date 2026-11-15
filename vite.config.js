import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// `npm run dev`       -> mode "development": services call the real API (/api proxy).
// `npm run dev:dummy` -> mode "dummy": services read the JSON seeds in src/data.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  server: {
    proxy: { '/api': 'http://localhost:5000' },
  },
})
