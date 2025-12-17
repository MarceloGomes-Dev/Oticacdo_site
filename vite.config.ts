
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // IMPORTANT: This ensures assets work when hosted in a subfolder (like GitHub Pages)
    base: './', 
    define: {
      // Polyfill process.env to prevent crashes in browser if standard env vars aren't used
      // And expose API_KEY
      'process.env': {
        API_KEY: env.API_KEY || env.VITE_API_KEY
      }
    }
  }
})
