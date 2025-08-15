import axios from 'axios'
import { API_BASE_URL } from '@/shared/config/env'

export const http = axios.create({ baseURL: API_BASE_URL, withCredentials: false })

http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('cc_jwt')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
  } catch {}
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try { localStorage.removeItem('cc_jwt') } catch {}
    }
    return Promise.reject(err)
  }
)
