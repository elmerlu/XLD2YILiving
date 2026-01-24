import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.PORT) || 5174

  return {
    plugins: [react()],
    base: '/XLD2YILiving/',
    server: {
      port: port,
      strictPort: true, // Fail if port is busy instead of switching
    }
  }
})
