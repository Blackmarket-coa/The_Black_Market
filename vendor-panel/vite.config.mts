import inject from "@medusajs/admin-vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import inspect from "vite-plugin-inspect"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  const BASE = env.VITE_MEDUSA_BASE || "/"
  const BACKEND_URL = env.VITE_MEDUSA_BACKEND_URL || (mode === 'production' ? '' : "http://localhost:9000")
  const STOREFRONT_URL = env.VITE_MEDUSA_STOREFRONT_URL || (mode === 'production' ? '' : "http://localhost:8000")
  const PUBLISHABLE_API_KEY = env.VITE_PUBLISHABLE_API_KEY || ""
  const TALK_JS_APP_ID = env.VITE_TALK_JS_APP_ID || ""
  const DISABLE_SELLERS_REGISTRATION = env.VITE_DISABLE_SELLERS_REGISTRATION || "false"
  const PUBLIC_BASE_URL = env.VITE_PUBLIC_BASE_URL || ""
  
  // Validate required environment variables in production
  if (mode === 'production') {
    const required = {
      VITE_MEDUSA_BACKEND_URL: BACKEND_URL,
      VITE_PUBLISHABLE_API_KEY: PUBLISHABLE_API_KEY,
    }
    
    const missing = Object.entries(required)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables for production: ${missing.join(', ')}\n` +
        `Please set these in Railway service settings -> Variables`
      )
    }
    
    // Warn about localhost in production URLs
    if (BACKEND_URL.includes('localhost')) {
      throw new Error(`VITE_MEDUSA_BACKEND_URL contains localhost in production mode: ${BACKEND_URL}`)
    }
  }
  
  const MEDUSA_PROJECT = env.VITE_MEDUSA_PROJECT || null
  const sources = MEDUSA_PROJECT ? [MEDUSA_PROJECT] : []
  
  const PORT = parseInt(process.env.PORT || '5173')

  return {
    plugins: [
      inspect(),
      react(),
      inject({
        sources,
      }),
    ],
    define: {
      __BASE__: JSON.stringify(BASE),
      __BACKEND_URL__: JSON.stringify(BACKEND_URL),
      __STOREFRONT_URL__: JSON.stringify(STOREFRONT_URL),
      __PUBLISHABLE_API_KEY__: JSON.stringify(PUBLISHABLE_API_KEY),
      __TALK_JS_APP_ID__: JSON.stringify(TALK_JS_APP_ID),
      __DISABLE_SELLERS_REGISTRATION__: JSON.stringify(DISABLE_SELLERS_REGISTRATION),
    },
    server: {
      host: '0.0.0.0',
      port: PORT,
      strictPort: false,
      open: false,
      allowedHosts: PUBLIC_BASE_URL 
        ? [PUBLIC_BASE_URL.replace('https://', '').replace('http://', '').split('/')[0]] 
        : [],
    },
    preview: {
      host: '0.0.0.0',
      port: PORT,
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    optimizeDeps: {
      entries: [],
      include: ["recharts"],
    },
  }
})
