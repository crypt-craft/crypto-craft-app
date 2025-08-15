export const env = {
  VITE_API_URI: import.meta.env.VITE_API_URI as string | undefined,
  VITE_REOWN_PROJECT_ID: import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined,
}

export const API_BASE_URL = env.VITE_API_URI || 'http://localhost:4000'
